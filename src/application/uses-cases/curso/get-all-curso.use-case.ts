import { RequestListarCurso } from 'src/shared/enums/request-list-curso-enum';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Curso } from 'src/core/entities/curso/curso.entity';
import { CursosService } from 'src/core/services/curso/cursos.service';
import { Result } from 'src/shared/domain/result/result';
import { plainToInstance } from 'class-transformer';
import { CursoResponseDto } from 'src/application/dto/curso/curso-response.dto';

@Injectable()
export class GetAllCursoUseCase {
  constructor(
    private readonly cursoService: CursosService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    request: RequestListarCurso = RequestListarCurso.LISTAR_CURSOS_ADMIN,
  ): Promise<Result<Curso[] | CursoResponseDto[]>> {
    try {
      const cursos = await this.cursoService.listarCursos(); 

      switch (request) {
        case RequestListarCurso.LISTAR_CURSOS_ANGULAR: {
          const lite = plainToInstance(CursoResponseDto, cursos, {
            excludeExtraneousValues: true,
          });
          return Result.okList(lite);
        }

        case RequestListarCurso.LISTAR_CURSOS_ADMIN:
        default: {
          return Result.okList(cursos);
        }
      }
    } catch (error) {
      return Result.fail(error);
    }
  }
}
