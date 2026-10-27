import { Injectable } from '@nestjs/common';
import { RegistrarProgresoCursoDto } from 'src/application/dto/progreso-curso';
import { ProgresoCurso } from 'src/core/entities/progreso-curso/progreso-curso.entity';
import { ProgresoCursoService } from 'src/core/services/progreso-curso/progreso-curso.service';
import { UsuarioAutenticado } from 'src/shared/auth/usuario-autenticado.interface';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class RegistrarProgresoCursoUseCase {
  constructor(private readonly service: ProgresoCursoService) {}

  async execute(
    usuario: UsuarioAutenticado,
    idCurso: string,
    dto: RegistrarProgresoCursoDto,
  ): Promise<Result<ProgresoCurso>> {
    try {
      const progreso = await this.service.registrar(usuario, idCurso, dto);
      return Result.ok(progreso);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
