import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtPayload, RequestConUsuario } from './usuario-autenticado.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestConUsuario>();
    const token = request.cookies?.accessToken as string | undefined;

    if (!token) {
      throw new UnauthorizedException('No autenticado');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = {
        id: Number(payload.sub),
        email: payload.email,
        idrol: payload.idrol,
        accessToken: token,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'El token ha expirado. Inicia sesión nuevamente.',
        );
      }
      throw new UnauthorizedException('No autenticado');
    }

    return true;
  }
}
