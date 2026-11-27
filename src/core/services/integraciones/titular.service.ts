import { HttpStatus, Injectable } from '@nestjs/common';
import { TipoCertificacion } from '@prisma/client';
import { UsuarioAutenticado } from 'src/shared/auth/usuario-autenticado.interface';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { AuthApiService, PermisosCuentaAsociada } from './auth-api.service';
import { TransactionApiService } from './transaction-api.service';

export interface Titular {
  idUsuario: number;
  idCuentaAsociada: number | null;
  nombre: string;
  tipoCertificacion: TipoCertificacion;
  permisos: PermisosCuentaAsociada | null;
}

@Injectable()
export class TitularService {
  constructor(
    private readonly authApi: AuthApiService,
    private readonly transactionApi: TransactionApiService,
  ) {}

  async resolver(usuario: UsuarioAutenticado): Promise<Titular> {
    const miCuenta = await this.authApi.obtenerMiCuenta(usuario.accessToken);
    const cuenta = miCuenta.cuentaAsociada;

    if (!cuenta) {
      return {
        idUsuario: usuario.id,
        idCuentaAsociada: null,
        nombre: miCuenta.nombre,
        tipoCertificacion: TipoCertificacion.RECONOCIMIENTO,
        permisos: null,
      };
    }

    if (cuenta.estado === 'INACTIVA') {
      throw new BussinesRuleException(
        'La cuenta asociada está desactivada',
        HttpStatus.FORBIDDEN,
        { codigoError: 'CUENTA_ASOCIADA_INACTIVA' },
      );
    }

    return {
      idUsuario: cuenta.idpadre,
      idCuentaAsociada: cuenta.id,
      nombre: miCuenta.nombre,
      tipoCertificacion: TipoCertificacion[cuenta.tipocuenta],
      permisos: cuenta.permisos,
    };
  }

  // Solo el usuario principal (padre) emite: para él mismo o para una de sus cuentas asociadas
  async resolverParaEmision(
    usuario: UsuarioAutenticado,
    idCuentaAsociada?: number,
  ): Promise<Titular> {
    const miCuenta = await this.authApi.obtenerMiCuenta(usuario.accessToken);

    if (miCuenta.cuentaAsociada) {
      throw new BussinesRuleException(
        'Solo el usuario principal puede emitir certificados',
        HttpStatus.FORBIDDEN,
        { codigoError: 'SOLO_PADRE_EMITE' },
      );
    }

    if (idCuentaAsociada === undefined) {
      return {
        idUsuario: usuario.id,
        idCuentaAsociada: null,
        nombre: miCuenta.nombre,
        tipoCertificacion: TipoCertificacion.RECONOCIMIENTO,
        permisos: null,
      };
    }

    const cuenta = await this.authApi.obtenerDetalleCuentaAsociada(
      idCuentaAsociada,
      usuario.accessToken,
    );

    if (cuenta.estado !== 'ACTIVA') {
      throw new BussinesRuleException(
        'La cuenta asociada no está activa',
        HttpStatus.FORBIDDEN,
        { codigoError: 'CUENTA_ASOCIADA_NO_ACTIVA', estado: cuenta.estado },
      );
    }

    return {
      idUsuario: cuenta.idpadre,
      idCuentaAsociada: cuenta.id,
      nombre: cuenta.alias ?? cuenta.usuario?.username ?? '',
      tipoCertificacion: TipoCertificacion[cuenta.tipocuenta],
      permisos: null,
    };
  }

  async tieneAccesoAlCurso(
    titular: Titular,
    idCurso: string,
    accessToken: string,
  ): Promise<boolean> {
    if (titular.idCuentaAsociada !== null) {
      const asignados = await this.authApi.obtenerCursosAsignados(
        titular.idCuentaAsociada,
        accessToken,
      );
      return asignados.some(
        (curso) => curso.idcurso === idCurso && curso.estado !== 'CANCELADO',
      );
    }

    const comprados = await this.transactionApi.obtenerCursosComprados(
      titular.idUsuario,
    );
    return comprados.includes(idCurso);
  }
}
