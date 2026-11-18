import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, RequestConUsuario } from './usuario-autenticado.interface';

// Para endpoints publicos (ej. ver un curso) que igual necesitan saber QUIEN pregunta, si esta
// logueado, para decidir que mostrarle (ej. el candado de modulos pagos) -- a diferencia de
// JwtAuthGuard, nunca bloquea: si no hay token o es invalido, sigue sin request.user.
@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestConUsuario>();
    const token = request.cookies?.accessToken as string | undefined;

    if (!token) {
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = {
        id: Number(payload.sub),
        email: payload.email,
        idrol: payload.idrol,
        accessToken: token,
      };
    } catch {
      // Token invalido o vencido: se trata como visitante anonimo, no se bloquea.
    }

    return true;
  }
}
