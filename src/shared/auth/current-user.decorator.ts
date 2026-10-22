import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  RequestConUsuario,
  UsuarioAutenticado,
} from './usuario-autenticado.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UsuarioAutenticado | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestConUsuario>();
    return request.user;
  },
);
