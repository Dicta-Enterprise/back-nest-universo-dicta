import { ProgresoModulo } from 'src/core/entities/progreso-modulo/progreso-modulo.entity';

export interface ProgresoModuloRepository {
  find(usuarioId: number, cursoId: string, moduloId: string): Promise<ProgresoModulo | null>;
  findByUsuarios(usuarioIds: number[]): Promise<ProgresoModulo[]>;
  upsert(progreso: ProgresoModulo): Promise<ProgresoModulo>;
}
