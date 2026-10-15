import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ROL_ADMIN_ID } from '@constants/constants';

// Se usa después de jwtAuthGuard: deja pasar solo a quien tenga el rol de administrador en su sesión.
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const usuario = context.switchToHttp().getRequest().user;

    if (!usuario || Number(usuario.idrol) !== ROL_ADMIN_ID) {
      throw new ForbiddenException('Solo los administradores pueden usar este recurso.');
    }

    return true;
  }
}
