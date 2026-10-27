import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

const contexto = (user?: unknown) =>
  ({ switchToHttp: () => ({ getRequest: () => ({ user }) }) }) as unknown as ExecutionContext;

describe('AdminGuard', () => {
  const guard = new AdminGuard();

  it('deja pasar al administrador (idrol 1)', () => {
    expect(guard.canActivate(contexto({ id: 1, idrol: 1 }))).toBe(true);
  });

  it('rechaza a un padre, a un rol sin definir y a quien no tiene sesión', () => {
    expect(() => guard.canActivate(contexto({ id: 5, idrol: 3 }))).toThrow(ForbiddenException);
    expect(() => guard.canActivate(contexto({ id: 5 }))).toThrow(ForbiddenException);
    expect(() => guard.canActivate(contexto(undefined))).toThrow(ForbiddenException);
  });
});
