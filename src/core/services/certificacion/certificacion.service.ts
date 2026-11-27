import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import {
  EstadoBlockchain,
  EstadoCertificacion,
  EstadoProgresoCurso,
  TipoCertificacion,
} from '@prisma/client';
import { randomBytes } from 'crypto';
import {
  AnularCertificacionDto,
  EmitirCertificacionDto,
  ReemitirCertificacionDto,
} from 'src/application/dto/certificacion';
import { envs } from 'src/config/envs';
import {
  CERTIFICACION_REPOSITORY,
  PLANTILLA_CERTIFICACION_REPOSITORY,
} from 'src/core/constants/constants';
import { Certificacion } from 'src/core/entities/certificacion/certificacion.entity';
import {
  CertificacionRepository,
  DatosAnulacionCertificacion,
} from 'src/core/repositories/certificacion/certificacion.repository';
import { PlantillaCertificacionRepository } from 'src/core/repositories/plantilla-certificacion/plantilla-certificacion.repository';
import { BlockchainService } from 'src/core/services/blockchain/blockchain.service';
import { PinataService } from 'src/core/services/blockchain/pinata.service';
import { PrivyService } from 'src/core/services/blockchain/privy.service';
import { TitularService } from 'src/core/services/integraciones/titular.service';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { ProgresoCursoService } from 'src/core/services/progreso-curso/progreso-curso.service';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import {
  ROL_ADMINISTRADOR,
  UsuarioAutenticado,
} from 'src/shared/auth/usuario-autenticado.interface';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { BunnyStorageService } from './bunny-storage.service';
import { CertificadoPdfService } from './certificado-pdf.service';

const INTENTOS_CODIGO_UNICO = 5;
const ZONA_HORARIA = 'America/Lima';
const FORMATO_ID = /^[0-9a-fA-F]{24}$/;

// El motivo que va al contrato es público y permanente: nunca el texto que escribe el admin
const MOTIVO_ANULACION_EN_CADENA = 'ANULADO';
const MOTIVO_REEMISION_EN_CADENA = 'REEMITIDO';

// Un registro normal tarda segundos; la espera máxima en la cola es de 5 minutos
const MINUTOS_PENDIENTE_TRABADO = 10;

// Lo que ve cualquiera que escanea el QR: sin ids internos, wallet ni motivo de anulación
export interface ValidacionCertificado {
  valido: boolean;
  codigoCertificado: string;
  nombreTitular: string;
  nombreCurso: string;
  tipoCertificacion: TipoCertificacion;
  fechaEmision: Date;
  estado: EstadoCertificacion;
  fechaAnulacion: Date | null;
  codigoCertificadoReemplazo: string | null;
  blockchain: {
    estado: EstadoBlockchain;
    red: string;
    chainId: number;
    contrato: string;
    tokenId: string | null;
    txHash: string | null;
    urlTransaccion: string | null;
    urlToken: string | null;
    fechaRegistro: Date | null;
    urlRevocacion: string | null;
    // null si no está registrado o no se pudo leer el contrato en este momento
    revocado: boolean | null;
    coincideCodigo: boolean | null;
  };
}

@Injectable()
export class CertificacionService {
  private readonly logger = new Logger(CertificacionService.name);

  constructor(
    @Inject(CERTIFICACION_REPOSITORY)
    private readonly repository: CertificacionRepository,
    @Inject(PLANTILLA_CERTIFICACION_REPOSITORY)
    private readonly plantillaRepository: PlantillaCertificacionRepository,
    private readonly titularService: TitularService,
    private readonly progresoCursoService: ProgresoCursoService,
    private readonly blockchainService: BlockchainService,
    private readonly pinataService: PinataService,
    private readonly privyService: PrivyService,
    private readonly validator: ValidatorService,
    private readonly prisma: PrismaService,
    private readonly certificadoPdfService: CertificadoPdfService,
    private readonly bunnyStorageService: BunnyStorageService,
  ) {}

  async emitir(
    usuario: UsuarioAutenticado,
    dto: EmitirCertificacionDto,
  ): Promise<Certificacion> {
    await this.validator.validate(dto, EmitirCertificacionDto);

    const nombreTitular = this.normalizarNombre(dto.nombreTitular);

    const curso = await this.prisma.curso.findUnique({
      where: { id: dto.idCurso },
    });
    if (!curso) {
      throw new BussinesRuleException('El curso no existe', HttpStatus.NOT_FOUND, {
        idCurso: dto.idCurso,
        codigoError: 'CURSO_NO_ENCONTRADO',
      });
    }

    const titular = await this.titularService.resolverParaEmision(
      usuario,
      dto.idCuentaAsociada,
    );

    const tieneAcceso = await this.titularService.tieneAccesoAlCurso(
      titular,
      dto.idCurso,
      usuario.accessToken,
    );
    if (!tieneAcceso) {
      throw new BussinesRuleException(
        'El curso no corresponde a esta cuenta',
        HttpStatus.FORBIDDEN,
        { idCurso: dto.idCurso, codigoError: 'CURSO_NO_CORRESPONDE' },
      );
    }

    const progreso = await this.progresoCursoService.buscarPorTitular(
      titular,
      dto.idCurso,
    );
    if (progreso?.estado !== EstadoProgresoCurso.COMPLETADO) {
      throw new BussinesRuleException(
        'El curso todavía no está completado',
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          idCurso: dto.idCurso,
          porcentaje: progreso?.porcentaje ?? 0,
          codigoError: 'CURSO_NO_COMPLETADO',
        },
      );
    }

    const yaEmitida = await this.repository.findEmitidaByTitularYCurso(
      titular.idUsuario,
      titular.idCuentaAsociada,
      dto.idCurso,
      titular.tipoCertificacion,
    );
    if (yaEmitida) {
      throw new BussinesRuleException(
        'Ya existe un certificado emitido para este curso',
        HttpStatus.CONFLICT,
        {
          codigoCertificado: yaEmitida.codigoCertificado,
          codigoError: 'CERTIFICADO_YA_EMITIDO',
        },
      );
    }

    const plantilla = await this.plantillaRepository.findActivaByTipo(
      titular.tipoCertificacion,
    );
    if (!plantilla) {
      throw new BussinesRuleException(
        'No hay una plantilla activa para este tipo de certificado',
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          tipoCertificacion: titular.tipoCertificacion,
          codigoError: 'PLANTILLA_ACTIVA_NO_ENCONTRADA',
        },
      );
    }

    const certificacion = await this.repository.crear({
      idUsuario: titular.idUsuario,
      idCuentaAsociada: titular.idCuentaAsociada,
      idCurso: dto.idCurso,
      idPlantilla: plantilla.id,
      codigoCertificado: await this.generarCodigoUnico(),
      nombreCertificado: curso.nombre,
      nombreTitular,
      tipoCertificacion: titular.tipoCertificacion,
      configuracionSnapshot: plantilla.configuracion,
      urlPlantillaSnapshot: plantilla.urlPlantilla,
    });

    // No se espera: el registro en Polygon tarda y el resultado queda en estadoBlockchain
    void this.registrarEnBlockchain(certificacion, usuario.email);
    void this.guardarPdf(certificacion);

    return this.paraRespuesta(certificacion);
  }

  async obtener(
    usuario: UsuarioAutenticado,
    id: string,
  ): Promise<Certificacion> {
    const certificacion = await this.buscarPorId(id);
    await this.verificarAcceso(usuario, certificacion);
    return this.paraRespuesta(certificacion);
  }

  // Un padre ve los suyos y los de sus hijos; un hijo solo los suyos, si tiene permiso
  async listarMisCertificaciones(
    usuario: UsuarioAutenticado,
  ): Promise<Certificacion[]> {
    const titular = await this.titularService.resolver(usuario);

    if (titular.idCuentaAsociada === null) {
      const propias = await this.repository.findAllByUsuario(titular.idUsuario);
      return propias.map((c) => this.paraRespuesta(c));
    }

    if (!titular.permisos?.puedeVerCertificados) {
      throw new BussinesRuleException(
        'Esta cuenta no tiene permiso para ver certificados',
        HttpStatus.FORBIDDEN,
        { codigoError: 'SIN_PERMISO_CERTIFICADOS' },
      );
    }

    const delHijo = await this.repository.findAllByCuentaAsociada(
      titular.idCuentaAsociada,
    );
    return delHijo.map((c) => this.paraRespuesta(c));
  }

  // Solo admin. Si estaba en Polygon, la revocación sigue en segundo plano
  async anular(
    admin: UsuarioAutenticado,
    codigo: string,
    dto: AnularCertificacionDto,
  ): Promise<Certificacion> {
    await this.validator.validate(dto, AnularCertificacionDto);

    const certificacion = await this.buscarParaAnular(codigo);
    const anulada = await this.repository.anular(
      certificacion.id,
      this.datosAnulacion(admin, dto.motivo),
    );
    if (!anulada) throw this.errorYaAnulado(certificacion.codigoCertificado);

    // Si el registro había fallado no hay nada que revocar en el contrato
    if (anulada.estadoBlockchain === EstadoBlockchain.REGISTRADO) {
      void this.revocarEnBlockchain(anulada);
    }

    return this.paraRespuesta(anulada);
  }

  // Solo admin. Anula el anterior y crea uno nuevo; en Polygon es una sola transacción (reissue)
  async reemitir(
    admin: UsuarioAutenticado,
    codigo: string,
    dto: ReemitirCertificacionDto,
  ): Promise<Certificacion> {
    await this.validator.validate(dto, ReemitirCertificacionDto);

    const anterior = await this.buscarParaAnular(codigo);
    if (
      anterior.estadoBlockchain !== EstadoBlockchain.REGISTRADO ||
      !anterior.tokenId ||
      !anterior.walletDestino
    ) {
      throw new BussinesRuleException(
        'Solo se puede reemitir un certificado registrado en blockchain. Si su registro falló, anúlalo y el usuario puede volver a emitirlo.',
        HttpStatus.CONFLICT,
        {
          codigoCertificado: anterior.codigoCertificado,
          estadoBlockchain: anterior.estadoBlockchain,
          codigoError: 'CERTIFICADO_NO_REGISTRADO_EN_BLOCKCHAIN',
        },
      );
    }

    // Mismo curso, titular y plantilla: solo cambian el código y, si se corrige, el nombre
    const nueva = await this.repository.reemitir(
      anterior.id,
      this.datosAnulacion(admin, dto.motivo),
      {
        idUsuario: anterior.idUsuario,
        idCuentaAsociada: anterior.idCuentaAsociada,
        idCurso: anterior.idCurso,
        idPlantilla: anterior.idPlantilla,
        codigoCertificado: await this.generarCodigoUnico(),
        nombreCertificado: anterior.nombreCertificado,
        nombreTitular: dto.nombreTitular
          ? this.normalizarNombre(dto.nombreTitular)
          : anterior.nombreTitular,
        tipoCertificacion: anterior.tipoCertificacion,
        configuracionSnapshot: anterior.configuracionSnapshot,
        urlPlantillaSnapshot: anterior.urlPlantillaSnapshot,
      },
    );
    if (!nueva) throw this.errorYaAnulado(anterior.codigoCertificado);

    void this.reemitirEnBlockchain(
      anterior.id,
      anterior.tokenId,
      anterior.walletDestino,
      nueva,
    );
    void this.guardarPdf(nueva);

    return this.paraRespuesta(nueva);
  }

  // Admin o el padre dueño. Retoma lo que quedó a medias en blockchain; la cola
  // evita mandar dos veces la misma transacción
  async reintentarBlockchain(
    usuario: UsuarioAutenticado,
    codigo: string,
  ): Promise<Certificacion> {
    const certificacion = await this.buscarPorCodigo(codigo);
    const esDueno = certificacion.idUsuario === usuario.id;
    if (usuario.idrol !== ROL_ADMINISTRADOR && !esDueno) {
      throw new BussinesRuleException(
        'No tienes permiso sobre este certificado',
        HttpStatus.FORBIDDEN,
        { codigoError: 'SIN_PERMISO_CERTIFICADO' },
      );
    }

    if (
      certificacion.estadoBlockchain === EstadoBlockchain.PENDIENTE &&
      !this.estaTrabado(certificacion)
    ) {
      throw this.errorEnProceso(certificacion.codigoCertificado);
    }

    // Anulado: lo único pendiente puede ser revocarlo en el contrato
    if (certificacion.estado === EstadoCertificacion.ANULADA) {
      if (certificacion.idCertificadoReemplazo) {
        const reemplazo = await this.repository.findById(
          certificacion.idCertificadoReemplazo,
        );
        throw new BussinesRuleException(
          'Este certificado fue reemitido: el reintento se hace sobre el certificado nuevo',
          HttpStatus.CONFLICT,
          {
            codigoCertificadoReemplazo: reemplazo?.codigoCertificado ?? null,
            codigoError: 'REINTENTAR_EN_REEMPLAZO',
          },
        );
      }
      if (certificacion.estadoBlockchain !== EstadoBlockchain.REGISTRADO) {
        throw this.errorNadaQueReintentar(certificacion);
      }

      void this.revocarEnBlockchain(certificacion);
      return this.paraRespuesta(certificacion);
    }

    if (certificacion.estadoBlockchain === EstadoBlockchain.REGISTRADO) {
      throw this.errorNadaQueReintentar(certificacion);
    }

    const anterior = await this.repository.findReemplazadoPor(certificacion.id);

    // Sin wallet todavía hay que pedírsela a Privy con el email del padre, y el admin no lo tiene
    if (!anterior && !certificacion.walletDestino && !esDueno) {
      throw new BussinesRuleException(
        'Este certificado no llegó a tener wallet. El usuario tiene que reintentarlo desde su cuenta.',
        HttpStatus.CONFLICT,
        { codigoError: 'REINTENTO_REQUIERE_TITULAR' },
      );
    }

    const pendiente = await this.repository.actualizarBlockchain(
      certificacion.id,
      { estadoBlockchain: EstadoBlockchain.PENDIENTE, errorBlockchain: null },
    );

    if (anterior) {
      void this.reemitirEnBlockchain(
        anterior.id,
        anterior.tokenId as string,
        anterior.walletDestino as string,
        pendiente,
      );
    } else {
      void this.registrarEnBlockchain(pendiente, usuario.email);
    }

    return this.paraRespuesta(pendiente);
  }

  // Entrega el PDF guardado en Bunny. Si todavía no está, lo arma con la plantilla
  // guardada al emitir y lo sube para la próxima vez
  async generarPdf(
    usuario: UsuarioAutenticado,
    id: string,
  ): Promise<{ nombreArchivo: string; contenido: Buffer }> {
    const certificacion = await this.buscarPorId(id);
    await this.verificarAcceso(usuario, certificacion);

    if (certificacion.estado === EstadoCertificacion.ANULADA) {
      throw new BussinesRuleException(
        'El certificado está anulado',
        HttpStatus.CONFLICT,
        {
          codigoCertificado: certificacion.codigoCertificado,
          codigoError: 'CERTIFICADO_ANULADO',
        },
      );
    }

    const nombreArchivo = this.nombreArchivoPdf(certificacion);

    if (certificacion.urlCertificado) {
      try {
        const guardado = await this.bunnyStorageService.descargar(
          certificacion.urlCertificado,
        );
        if (guardado) return { nombreArchivo, contenido: guardado };

        this.logger.warn(
          `El PDF de ${certificacion.codigoCertificado} ya no está en Bunny: se vuelve a generar`,
        );
      } catch (error) {
        // Bunny caído: se entrega igual, armado en el momento, sin volver a subirlo
        this.logger.error(
          `No se pudo leer de Bunny el PDF de ${certificacion.codigoCertificado}: ${mensajeDe(error)}`,
        );
        return { nombreArchivo, contenido: await this.armarPdf(certificacion) };
      }
    }

    const contenido = await this.armarPdf(certificacion);
    void this.subirPdf(certificacion, contenido);

    return { nombreArchivo, contenido };
  }

  // Público: lo usa la página a la que lleva el QR del certificado
  async validar(codigo: string): Promise<ValidacionCertificado> {
    const certificacion = await this.buscarPorCodigo(codigo);

    const reemplazo = certificacion.idCertificadoReemplazo
      ? await this.repository.findById(certificacion.idCertificadoReemplazo)
      : null;

    const { tokenId, txHash, txHashRevocacion } = certificacion;
    const enCadena = await this.leerEnBlockchain(certificacion);

    // Si no se pudo leer el contrato, manda lo que dice la base de datos
    const valido =
      certificacion.estado === EstadoCertificacion.EMITIDA &&
      enCadena.revocado !== true &&
      enCadena.coincideCodigo !== false;

    return {
      valido,
      codigoCertificado: certificacion.codigoCertificado,
      nombreTitular: certificacion.nombreTitular,
      nombreCurso: certificacion.nombreCertificado,
      tipoCertificacion: certificacion.tipoCertificacion,
      fechaEmision: certificacion.fechaEmision,
      estado: certificacion.estado,
      fechaAnulacion: certificacion.fechaAnulacion,
      codigoCertificadoReemplazo: reemplazo?.codigoCertificado ?? null,
      blockchain: {
        estado: certificacion.estadoBlockchain,
        ...this.blockchainService.datosRed(),
        tokenId,
        txHash,
        urlTransaccion: txHash
          ? this.blockchainService.urlTransaccion(txHash)
          : null,
        urlToken: tokenId ? this.blockchainService.urlToken(tokenId) : null,
        fechaRegistro: certificacion.fechaRegistroBlockchain,
        urlRevocacion: txHashRevocacion
          ? this.blockchainService.urlTransaccion(txHashRevocacion)
          : null,
        ...enCadena,
      },
    };
  }

  // Lee el contrato en vivo: así una revocación se ve aunque la base diga otra cosa
  private async leerEnBlockchain(
    certificacion: Certificacion,
  ): Promise<{ revocado: boolean | null; coincideCodigo: boolean | null }> {
    const estuvoEnCadena =
      certificacion.estadoBlockchain === EstadoBlockchain.REGISTRADO ||
      certificacion.estadoBlockchain === EstadoBlockchain.REVOCADO;
    if (!estuvoEnCadena || !certificacion.tokenId) {
      return { revocado: null, coincideCodigo: null };
    }

    try {
      const token = await this.blockchainService.consultarCertificado(
        certificacion.tokenId,
      );
      return {
        revocado: token.revocado,
        coincideCodigo:
          token.codigoCertificado === certificacion.codigoCertificado,
      };
    } catch {
      // consultarCertificado ya registra el error en el log
      return { revocado: null, coincideCodigo: null };
    }
  }

  // Privy (wallet del padre) → Pinata (metadatos) → cola → contrato.
  // Cada paso se guarda apenas termina, así un reintento no lo repite
  private async registrarEnBlockchain(
    certificacion: Certificacion,
    emailPadre: string,
  ): Promise<void> {
    try {
      let walletDestino = certificacion.walletDestino;
      if (!walletDestino) {
        walletDestino = await this.privyService.obtenerOCrearWallet(emailPadre);
        await this.repository.actualizarBlockchain(certificacion.id, {
          walletDestino,
        });
      }

      const uriMetadatos = await this.obtenerUriMetadatos(certificacion);
      const registro = await this.blockchainService.registrarCertificado(
        certificacion.codigoCertificado,
        uriMetadatos,
        walletDestino,
      );

      await this.repository.actualizarBlockchain(certificacion.id, {
        estadoBlockchain: EstadoBlockchain.REGISTRADO,
        walletDestino,
        uriMetadatos,
        tokenId: registro.tokenId,
        txHash: registro.txHash,
        fechaRegistroBlockchain: new Date(),
        errorBlockchain: null,
      });
    } catch (error) {
      await this.guardarFallo(certificacion, EstadoBlockchain.FALLIDO, error);
    }
  }

  private async revocarEnBlockchain(certificacion: Certificacion): Promise<void> {
    try {
      const revocacion = await this.blockchainService.revocarCertificado(
        certificacion.codigoCertificado,
        certificacion.tokenId as string,
        MOTIVO_ANULACION_EN_CADENA,
      );

      await this.repository.actualizarBlockchain(certificacion.id, {
        estadoBlockchain: EstadoBlockchain.REVOCADO,
        txHashRevocacion: revocacion.txHash,
        errorBlockchain: null,
      });
    } catch (error) {
      // Sigue REGISTRADO: queda anulado en la base pero vigente en el contrato
      await this.guardarFallo(
        certificacion,
        EstadoBlockchain.REGISTRADO,
        error,
        'No se pudo revocar',
      );
    }
  }

  // reissue revoca el token anterior y crea el nuevo en la misma wallet
  private async reemitirEnBlockchain(
    idAnterior: string,
    tokenIdAnterior: string,
    walletDestino: string,
    nueva: Certificacion,
  ): Promise<void> {
    try {
      const uriMetadatos = await this.obtenerUriMetadatos(nueva);
      const registro = await this.blockchainService.reemitirCertificado(
        tokenIdAnterior,
        nueva.codigoCertificado,
        uriMetadatos,
        walletDestino,
        MOTIVO_REEMISION_EN_CADENA,
      );

      await this.repository.actualizarBlockchain(nueva.id, {
        estadoBlockchain: EstadoBlockchain.REGISTRADO,
        walletDestino,
        uriMetadatos,
        tokenId: registro.tokenId,
        txHash: registro.txHash,
        fechaRegistroBlockchain: new Date(),
        errorBlockchain: null,
      });
      await this.repository.actualizarBlockchain(idAnterior, {
        estadoBlockchain: EstadoBlockchain.REVOCADO,
        txHashRevocacion: registro.txHash,
        errorBlockchain: null,
      });
    } catch (error) {
      // El anterior sigue vigente en el contrato hasta que se reintente
      await this.guardarFallo(nueva, EstadoBlockchain.FALLIDO, error);
    }
  }

  // Reusa los metadatos si ya se subieron: cada archivo cuenta para el límite gratis de Pinata
  private async obtenerUriMetadatos(
    certificacion: Certificacion,
  ): Promise<string> {
    if (certificacion.uriMetadatos) return certificacion.uriMetadatos;

    const metadatos = await this.pinataService.subirMetadatos({
      codigoCertificado: certificacion.codigoCertificado,
      tipoCertificacion: certificacion.tipoCertificacion,
      nombreCurso: certificacion.nombreCertificado,
      nombreTitular: certificacion.nombreTitular,
      fechaEmision: certificacion.fechaEmision,
      urlVerificacion: this.urlVerificacion(certificacion.codigoCertificado),
    });
    await this.repository.actualizarBlockchain(certificacion.id, {
      uriMetadatos: metadatos.uri,
    });
    return metadatos.uri;
  }

  private async guardarFallo(
    certificacion: Certificacion,
    estadoBlockchain: EstadoBlockchain,
    error: unknown,
    prefijo = 'No se pudo registrar',
  ): Promise<void> {
    const mensaje = error instanceof Error ? error.message : String(error);
    this.logger.error(
      `${prefijo} en blockchain el certificado ${certificacion.codigoCertificado}: ${mensaje}`,
    );

    await this.repository
      .actualizarBlockchain(certificacion.id, {
        estadoBlockchain,
        errorBlockchain: `${prefijo}: ${mensaje}`,
      })
      .catch((errorGuardado) =>
        this.logger.error(
          `Tampoco se pudo guardar el fallo del certificado ${certificacion.codigoCertificado}`,
          errorGuardado instanceof Error
            ? errorGuardado.stack
            : String(errorGuardado),
        ),
      );
  }

  private async armarPdf(certificacion: Certificacion): Promise<Buffer> {
    if (!certificacion.urlPlantillaSnapshot) {
      throw new BussinesRuleException(
        'El certificado no tiene plantilla guardada',
        HttpStatus.UNPROCESSABLE_ENTITY,
        { codigoError: 'CERTIFICADO_SIN_PLANTILLA' },
      );
    }

    return this.certificadoPdfService.generar({
      codigoCertificado: certificacion.codigoCertificado,
      nombreTitular: certificacion.nombreTitular,
      nombreCurso: certificacion.nombreCertificado,
      fechaEmision: certificacion.fechaEmision,
      urlPlantilla: certificacion.urlPlantillaSnapshot,
      configuracion: certificacion.configuracionSnapshot,
      urlVerificacion: this.urlVerificacion(certificacion.codigoCertificado),
    });
  }

  // Al emitir. Si la plantilla todavía no sirve (ej. sin diseño), queda para la primera descarga
  private async guardarPdf(certificacion: Certificacion): Promise<void> {
    if (!this.bunnyStorageService.estaConfigurado(certificacion.tipoCertificacion)) {
      return;
    }

    try {
      await this.subirPdf(certificacion, await this.armarPdf(certificacion));
    } catch (error) {
      this.logger.warn(
        `No se pudo generar el PDF de ${certificacion.codigoCertificado} al emitir: ${mensajeDe(error)}. Se genera en la primera descarga.`,
      );
    }
  }

  // Un fallo acá no corta la descarga: el PDF se vuelve a subir en la próxima
  private async subirPdf(
    certificacion: Certificacion,
    contenido: Buffer,
  ): Promise<void> {
    if (!this.bunnyStorageService.estaConfigurado(certificacion.tipoCertificacion)) {
      return;
    }

    try {
      const url = await this.bunnyStorageService.subir(
        certificacion.tipoCertificacion,
        await this.carpetasBunny(certificacion),
        this.nombreArchivoPdf(certificacion),
        contenido,
      );
      await this.repository.guardarUrlCertificado(certificacion.id, url);
    } catch (error) {
      this.logger.error(
        `No se pudo guardar en Bunny el PDF de ${certificacion.codigoCertificado}: ${mensajeDe(error)}`,
      );
    }
  }

  // Galaxia/año/mes, como las carpetas que ya existen en Bunny (ej. "Galaxia salud física/2026/11")
  private async carpetasBunny(certificacion: Certificacion): Promise<string[]> {
    const curso = await this.prisma.curso.findUnique({
      where: { id: certificacion.idCurso },
      select: { planeta: { select: { galaxia: { select: { nombre: true } } } } },
    });
    const galaxia = curso?.planeta?.galaxia.nombre
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, ' ')
      .toLocaleLowerCase('es');

    const partes = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      timeZone: ZONA_HORARIA,
    }).formatToParts(certificacion.fechaEmision);
    const parte = (tipo: string) =>
      partes.find((p) => p.type === tipo)?.value ?? '00';

    return [
      galaxia ? `Galaxia ${galaxia}` : 'Sin galaxia',
      parte('year'),
      parte('month'),
    ];
  }

  private nombreArchivoPdf(certificacion: Certificacion): string {
    return `${certificacion.codigoCertificado}.pdf`;
  }

  // Hacia afuera, urlCertificado es la descarga del backend: el archivo en Bunny es privado
  private paraRespuesta(certificacion: Certificacion): Certificacion {
    return {
      ...certificacion,
      urlCertificado: `/api/certificaciones/${certificacion.id}/descargar`,
    };
  }

  private async buscarPorId(idRecibido: string): Promise<Certificacion> {
    const id = idRecibido.trim();
    const certificacion = FORMATO_ID.test(id)
      ? await this.repository.findById(id)
      : null;
    if (!certificacion) {
      throw new BussinesRuleException(
        'No existe un certificado con ese id',
        HttpStatus.NOT_FOUND,
        { id, codigoError: 'CERTIFICADO_NO_ENCONTRADO' },
      );
    }
    return certificacion;
  }

  private async buscarPorCodigo(codigo: string): Promise<Certificacion> {
    const codigoCertificado = codigo.trim().toUpperCase();
    const certificacion = await this.repository.findByCodigo(codigoCertificado);
    if (!certificacion) {
      throw new BussinesRuleException(
        'No existe un certificado con ese código',
        HttpStatus.NOT_FOUND,
        { codigoCertificado, codigoError: 'CERTIFICADO_NO_ENCONTRADO' },
      );
    }
    return certificacion;
  }

  private async buscarParaAnular(codigo: string): Promise<Certificacion> {
    const certificacion = await this.buscarPorCodigo(codigo);

    if (certificacion.estado === EstadoCertificacion.ANULADA) {
      throw this.errorYaAnulado(certificacion.codigoCertificado);
    }

    // Si se anula mientras se registra, el token quedaría vigente en el contrato
    if (certificacion.estadoBlockchain === EstadoBlockchain.PENDIENTE) {
      throw this.errorEnProceso(certificacion.codigoCertificado);
    }

    return certificacion;
  }

  // Más tiempo del que puede tardar un registro: el servidor se reinició a la mitad
  private estaTrabado(certificacion: Certificacion): boolean {
    const minutos =
      (Date.now() - certificacion.fechaActualizacion.getTime()) / 60_000;
    return minutos > MINUTOS_PENDIENTE_TRABADO;
  }

  private errorEnProceso(codigoCertificado: string): BussinesRuleException {
    return new BussinesRuleException(
      'El certificado todavía se está registrando en blockchain. Intenta de nuevo en unos minutos.',
      HttpStatus.CONFLICT,
      { codigoCertificado, codigoError: 'REGISTRO_BLOCKCHAIN_EN_PROCESO' },
    );
  }

  private errorNadaQueReintentar(
    certificacion: Certificacion,
  ): BussinesRuleException {
    return new BussinesRuleException(
      'Este certificado no tiene nada pendiente en blockchain',
      HttpStatus.CONFLICT,
      {
        codigoCertificado: certificacion.codigoCertificado,
        estado: certificacion.estado,
        estadoBlockchain: certificacion.estadoBlockchain,
        codigoError: 'NADA_QUE_REINTENTAR',
      },
    );
  }

  private datosAnulacion(
    admin: UsuarioAutenticado,
    motivo: string,
  ): DatosAnulacionCertificacion {
    return {
      motivoAnulacion: motivo.trim(),
      idUsuarioAnulacion: admin.id,
      fechaAnulacion: new Date(),
    };
  }

  private errorYaAnulado(codigoCertificado: string): BussinesRuleException {
    return new BussinesRuleException(
      'El certificado ya está anulado',
      HttpStatus.CONFLICT,
      { codigoCertificado, codigoError: 'CERTIFICADO_YA_ANULADO' },
    );
  }

  // Admin: cualquiera. Padre: los suyos y los de sus hijos. Hijo: los suyos, con permiso
  private async verificarAcceso(
    usuario: UsuarioAutenticado,
    certificacion: Certificacion,
  ): Promise<void> {
    if (usuario.idrol === ROL_ADMINISTRADOR) return;

    const titular = await this.titularService.resolver(usuario);
    const tieneAcceso =
      titular.idCuentaAsociada === null
        ? certificacion.idUsuario === titular.idUsuario
        : certificacion.idCuentaAsociada === titular.idCuentaAsociada &&
          Boolean(titular.permisos?.puedeVerCertificados);

    if (!tieneAcceso) {
      throw new BussinesRuleException(
        'No tienes permiso sobre este certificado',
        HttpStatus.FORBIDDEN,
        { codigoError: 'SIN_PERMISO_CERTIFICADO' },
      );
    }
  }

  private urlVerificacion(codigoCertificado: string): string {
    return `${envs.urlVerificacionCertificados}/${codigoCertificado}`;
  }

  private normalizarNombre(nombre: string): string {
    return nombre.trim().replace(/\s+/g, ' ');
  }

  private async generarCodigoUnico(): Promise<string> {
    for (let intento = 0; intento < INTENTOS_CODIGO_UNICO; intento++) {
      const codigo = `CERT-${new Date().getFullYear()}-${randomBytes(5)
        .toString('hex')
        .toUpperCase()}`;

      if (!(await this.repository.findByCodigo(codigo))) {
        return codigo;
      }
    }

    throw new BussinesRuleException(
      'No se pudo generar un código de certificado único',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { codigoError: 'CODIGO_CERTIFICADO_NO_GENERADO' },
    );
  }
}

function mensajeDe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
