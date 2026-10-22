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
