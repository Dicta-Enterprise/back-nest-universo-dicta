import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EstadoProgresoCurso } from '@prisma/client';
import { RegistrarProgresoCursoDto } from 'src/application/dto/progreso-curso/registrar-progreso-curso.dto';
import { PROGRESO_CURSO_REPOSITORY } from 'src/core/constants/constants';
import { ProgresoCurso } from 'src/core/entities/progreso-curso/progreso-curso.entity';
import { ProgresoCursoRepository } from 'src/core/repositories/progreso-curso/progreso-curso.repository';
import {
  Titular,
  TitularService,
} from 'src/core/services/integraciones/titular.service';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { UsuarioAutenticado } from 'src/shared/auth/usuario-autenticado.interface';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

@Injectable()
export class ProgresoCursoService {
  constructor(
    @Inject(PROGRESO_CURSO_REPOSITORY)
    private readonly repository: ProgresoCursoRepository,
    private readonly titularService: TitularService,
    private readonly validator: ValidatorService,
    private readonly prisma: PrismaService,
  ) {}

  async registrar(
    usuario: UsuarioAutenticado,
    idCurso: string,
    dto: RegistrarProgresoCursoDto,
  ): Promise<ProgresoCurso> {
    await this.validator.validate(dto, RegistrarProgresoCursoDto);

    const curso = await this.prisma.curso.findUnique({ where: { id: idCurso } });
    if (!curso) {
      throw new BussinesRuleException('El curso no existe', HttpStatus.NOT_FOUND, {
        idCurso,
        codigoError: 'CURSO_NO_ENCONTRADO',
      });
    }

    const titular = await this.titularService.resolver(usuario);

    const tieneAcceso = await this.titularService.tieneAccesoAlCurso(
      titular,
      idCurso,
      usuario.accessToken,
    );
    if (!tieneAcceso) {
      throw new BussinesRuleException(
        'El curso no corresponde a esta cuenta',
        HttpStatus.FORBIDDEN,
        { idCurso, codigoError: 'CURSO_NO_CORRESPONDE' },
      );
    }

    const existente = await this.buscarPorTitular(titular, idCurso);
    if (existente?.estado === EstadoProgresoCurso.COMPLETADO) {
      return existente;
    }

    const completado = dto.porcentaje >= 100;

    return this.repository.guardar({
      idUsuario: titular.idUsuario,
      idCuentaAsociada: titular.idCuentaAsociada,
      idCurso,
      porcentaje: dto.porcentaje,
      estado: completado
        ? EstadoProgresoCurso.COMPLETADO
        : EstadoProgresoCurso.EN_PROGRESO,
      fechaCompletado: completado ? new Date() : null,
    });
  }

  async listarMisProgresos(usuario: UsuarioAutenticado): Promise<ProgresoCurso[]> {
    const titular = await this.titularService.resolver(usuario);

    if (titular.idCuentaAsociada !== null) {
      return this.repository.findAllByCuentaAsociada(titular.idCuentaAsociada);
    }
    return this.repository.findAllByUsuario(titular.idUsuario);
  }

  async obtenerMiProgreso(
    usuario: UsuarioAutenticado,
    idCurso: string,
  ): Promise<ProgresoCurso> {
    const titular = await this.titularService.resolver(usuario);
    const progreso = await this.buscarPorTitular(titular, idCurso);

    if (!progreso) {
      throw new BussinesRuleException(
        'No hay progreso registrado para este curso',
        HttpStatus.NOT_FOUND,
        { idCurso, codigoError: 'PROGRESO_NO_ENCONTRADO' },
      );
    }
    return progreso;
  }

  async buscarPorTitular(
    titular: Titular,
    idCurso: string,
  ): Promise<ProgresoCurso | null> {
    return this.repository.findByTitularYCurso(
      titular.idUsuario,
      titular.idCuentaAsociada,
      idCurso,
    );
  }
}
