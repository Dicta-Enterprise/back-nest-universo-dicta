import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  RequestConUsuario,
  ROL_ADMINISTRADOR,
} from './usuario-autenticado.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestConUsuario>();

    if (request.user?.idrol !== ROL_ADMINISTRADOR) {
      throw new ForbiddenException('Necesitas permisos de administrador');
    }

    return true;
  }
}
