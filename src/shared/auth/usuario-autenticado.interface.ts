import { Request } from 'express';

export const ROL_ADMINISTRADOR = 1;

export interface JwtPayload {
  sub: string | number;
  email: string;
  idrol: number;
}

export interface UsuarioAutenticado {
  id: number;
  email: string;
  idrol: number;
  accessToken: string;
}

export interface RequestConUsuario extends Request {
  user?: UsuarioAutenticado;
}
