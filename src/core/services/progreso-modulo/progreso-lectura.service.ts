import { Inject, Injectable } from '@nestjs/common';
import { CURSO_REPOSITORY, PROGRESO_MODULO_REPOSITORY } from '@constants/constants';
import { ROL_ADMINISTRADOR } from 'src/shared/auth/usuario-autenticado.interface';
import { CursoRepository } from 'src/core/repositories/curso/curso.respository';
import { ProgresoModuloRepository } from 'src/core/repositories/progreso-modulo/progreso-modulo.repository';
import { ResumenProgreso } from 'src/core/entities/progreso-modulo/resumen-progreso';
import { AuthApiService, FamiliaAuth } from 'src/core/services/auth-api/auth-api.service';
import { construirResumen } from './resumen-progreso.builder';

// Usuario de la sesión (lo que deja JwtAuthGuard en request.user).
export interface UsuarioToken {
  id: number;
  idrol?: number;
}

@Injectable()
export class ProgresoLecturaService {
  constructor(
    private readonly authApi: AuthApiService,
    @Inject(PROGRESO_MODULO_REPOSITORY)
    private readonly progresoRepository: ProgresoModuloRepository,
    @Inject(CURSO_REPOSITORY)
    private readonly cursoRepository: CursoRepository,
  ) {}

  /**
   * El filtro por rol vive aquí, en el backend: el administrador ve todas las familias y
   * cualquier otro usuario solo ve la suya (donde él es el padre).
   */
  async obtenerResumen(usuario: UsuarioToken, periodo: { desde: Date; hasta: Date }): Promise<ResumenProgreso> {
    const familias = await this.familiasVisibles(usuario);
    const idsEstudiantes = familias.flatMap((f) => f.miembros.map((m) => m.idusuario));

    const [progresos, cursos] = await Promise.all([
      this.progresoRepository.findByUsuarios(idsEstudiantes),
      this.cursoRepository.findAllActive(),
    ]);

    return construirResumen(familias, progresos, cursos, periodo);
  }

  private async familiasVisibles(usuario: UsuarioToken): Promise<FamiliaAuth[]> {
    if (usuario.idrol === ROL_ADMINISTRADOR) {
      return this.authApi.listarFamilias();
    }
    const familia = await this.authApi.obtenerFamiliaPorPadre(usuario.id);
    return familia ? [familia] : [];
  }
}
