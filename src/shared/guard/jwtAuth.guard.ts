import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { envs } from 'src/config/envs';

@Injectable()
export class jwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedException('No autenticado');
    }

    try {
      request.user = jwt.verify(token, envs.jwtSecret);
      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('El token ha expirado. Inicia sesión nuevamente.');
      }
      throw new UnauthorizedException('No autenticado');
    }
  }
}
