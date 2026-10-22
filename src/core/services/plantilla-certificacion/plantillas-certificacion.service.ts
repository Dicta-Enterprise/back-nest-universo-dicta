import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EstadoPlantilla, TipoCertificacion } from '@prisma/client';
import { CreatePlantillaCertificacionDto } from 'src/application/dto/plantilla-certificacion/create-plantilla-certificacion.dto';
import { UpdatePlantillaCertificacionDto } from 'src/application/dto/plantilla-certificacion/update-plantilla-certificacion.dto';
import { PLANTILLA_CERTIFICACION_REPOSITORY } from 'src/core/constants/constants';
import { PlantillaCertificacion } from 'src/core/entities/plantilla-certificacion/plantilla-certificacion.entity';
import {
  FiltrosPlantillaCertificacion,
  PlantillaCertificacionRepository,
} from 'src/core/repositories/plantilla-certificacion/plantilla-certificacion.repository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

interface ConstructorPlantillaCertificacionDinamico {
  new (...args: unknown[]): PlantillaCertificacion;
}

function normalizarTipoCertificacion(valor: unknown): TipoCertificacion {
  const texto = String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  if (!Object.values(TipoCertificacion).includes(texto as TipoCertificacion)) {
    throw new BussinesRuleException(
      'tipoCertificacion no es un valor válido',
      HttpStatus.BAD_REQUEST,
      { valorRecibido: valor, codigoError: 'TIPO_CERTIFICACION_INVALIDO' },
    );
  }
  return texto as TipoCertificacion;
}

@Injectable()
export class PlantillasCertificacionService {
  constructor(
    @Inject(PLANTILLA_CERTIFICACION_REPOSITORY)
    private readonly repository: PlantillaCertificacionRepository,
    private readonly validator: ValidatorService,
  ) {}

  async crear(dto: CreatePlantillaCertificacionDto): Promise<PlantillaCertificacion> {
        if (dto.tipoCertificacion) {
      dto.tipoCertificacion = normalizarTipoCertificacion(dto.tipoCertificacion);
    }

    await this.validator.validate(dto, CreatePlantillaCertificacionDto);

    const estado = dto.estado ?? EstadoPlantilla.ACTIVA;

    if (estado === EstadoPlantilla.ACTIVA) {
      await this.validarSinConflictoDeActiva(dto.nombre, dto.tipoCertificacion);
    }

    const PlantillaInstanciable =
      PlantillaCertificacion as unknown as ConstructorPlantillaCertificacionDinamico;

    const plantilla = new PlantillaInstanciable(
      null,
      dto.nombre,
      dto.tipoCertificacion,
      dto.urlPlantilla,
      dto.configuracion,
      estado,
      new Date(),
      new Date(),
      dto.descripcion,
    );

    return this.repository.save(plantilla);
  }

  async listar(
    filtros?: FiltrosPlantillaCertificacion,
  ): Promise<PlantillaCertificacion[]> {
    return this.repository.findAll(filtros);
  }

  async obtenerUna(id: string): Promise<PlantillaCertificacion> {
    const plantilla = await this.repository.findById(id);
    if (!plantilla) {
      throw new BussinesRuleException(
        'La plantilla de certificación no existe',
        HttpStatus.NOT_FOUND,
        { id, codigoError: 'PLANTILLA_NO_ENCONTRADA' },
      );
    }
    return plantilla;
  }

  async actualizar(
    id: string,
    dto: UpdatePlantillaCertificacionDto,
  ): Promise<PlantillaCertificacion> {
        if (dto.tipoCertificacion) {
      dto.tipoCertificacion = normalizarTipoCertificacion(dto.tipoCertificacion);
    }

    await this.validator.validate(dto, UpdatePlantillaCertificacionDto);

    const existente = await this.obtenerUna(id);

    const nombre = dto.nombre ?? existente.nombre;
    const tipoCertificacion = dto.tipoCertificacion ?? existente.tipoCertificacion;

    if (existente.estado === EstadoPlantilla.ACTIVA) {
      await this.validarSinConflictoDeActiva(nombre, tipoCertificacion, id);
    }

    return this.repository.update(id, {
      nombre,
      descripcion: dto.descripcion ?? existente.descripcion,
      tipoCertificacion,
      urlPlantilla: dto.urlPlantilla ?? existente.urlPlantilla,
      configuracion: dto.configuracion ?? existente.configuracion,
    });
  }

  async activar(id: string): Promise<PlantillaCertificacion> {
    const existente = await this.obtenerUna(id);
    await this.validarSinConflictoDeActiva(
      existente.nombre,
      existente.tipoCertificacion,
      id,
    );
    return this.repository.update(id, { estado: EstadoPlantilla.ACTIVA });
  }

  async desactivar(id: string): Promise<PlantillaCertificacion> {
    await this.obtenerUna(id);
    return this.repository.update(id, { estado: EstadoPlantilla.INACTIVA });
  }

  async eliminar(id: string): Promise<void> {
    await this.obtenerUna(id);

    const tieneCertificaciones = await this.repository.tieneCertificacionesAsociadas(id);
    if (tieneCertificaciones) {
      throw new BussinesRuleException(
        'No se puede eliminar la plantilla porque ya fue utilizada para emitir certificaciones. Desactívala en su lugar.',
        HttpStatus.BAD_REQUEST,
        { id, codigoError: 'PLANTILLA_CON_CERTIFICACIONES_ASOCIADAS' },
      );
    }

    await this.repository.delete(id);
  }

  private async validarSinConflictoDeActiva(
    nombre: string,
    tipoCertificacion: TipoCertificacion,
    excludeId?: string,
  ): Promise<void> {
    const nombreEnConflicto = await this.repository.findActivaByNombre(nombre, excludeId);
    if (nombreEnConflicto) {
      throw new BussinesRuleException(
        'Ya existe una plantilla activa con ese nombre',
        HttpStatus.BAD_REQUEST,
        { nombre, codigoError: 'PLANTILLA_NOMBRE_ACTIVA_DUPLICADA' },
      );
    }

    const tipoEnConflicto = await this.repository.findActivaByTipo(tipoCertificacion, excludeId);
    if (tipoEnConflicto) {
      throw new BussinesRuleException(
        'Ya existe una plantilla activa para este tipo de certificación',
        HttpStatus.BAD_REQUEST,
        { tipoCertificacion, codigoError: 'PLANTILLA_TIPO_YA_ACTIVO' },
      );
    }
  }
}
