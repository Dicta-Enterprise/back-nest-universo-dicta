import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as dto from 'src/application/dto/progreso-curso';
import * as useCase from 'src/application/uses-cases/progreso-curso';
import { CurrentUser } from 'src/shared/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { UsuarioAutenticado } from 'src/shared/auth/usuario-autenticado.interface';
import { lanzarErrorHttp } from 'src/shared/domain/exceptions/lanzar-error-http';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';

@ApiTags('Progreso de Cursos')
@Controller('progreso-curso')
@UseGuards(JwtAuthGuard)
@ApiResponse({ status: 401, description: 'No autenticado o sesión expirada.' })
export class ProgresoCursoController {
  constructor(
    private registrarUseCase: useCase.RegistrarProgresoCursoUseCase,
    private getMisProgresosUseCase: useCase.GetMisProgresosCursoUseCase,
    private getMiProgresoUseCase: useCase.GetMiProgresoCursoUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Lista el progreso de cursos del usuario autenticado',
    description:
      'Una cuenta asociada ve solo su progreso. Un usuario principal ve el suyo y el de sus cuentas asociadas.',
  })
  @ApiResponse({ status: 200, description: 'Progresos obtenidos correctamente.' })
  async findAll(@CurrentUser() usuario: UsuarioAutenticado) {
    const result = await this.getMisProgresosUseCase.execute(usuario);
    if (result.isFailure) lanzarErrorHttp(result.error);
    return { data: result.getValue(), message: 'Progresos obtenidos.' };
  }

  @Get(':idCurso')
  @ApiParam({ name: 'idCurso', description: 'ID (ObjectId de Mongo) del curso.' })
  @ApiOperation({ summary: 'Obtiene el progreso del usuario autenticado en un curso' })
  @ApiResponse({ status: 200, description: 'Progreso obtenido correctamente.' })
  @ApiResponse({ status: 404, description: 'No hay progreso registrado para ese curso.' })
  async findOne(
    @Param('idCurso', ParseObjectIdPipe) idCurso: string,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    const result = await this.getMiProgresoUseCase.execute(usuario, idCurso);
    if (result.isFailure) lanzarErrorHttp(result.error);
    return { data: result.getValue(), message: 'Progreso obtenido.' };
  }

  @Put(':idCurso')
  @ApiParam({ name: 'idCurso', description: 'ID (ObjectId de Mongo) del curso.' })
  @ApiOperation({
    summary: 'Registra o actualiza el progreso del usuario autenticado en un curso',
    description:
      'El curso debe corresponder a la cuenta: comprado (usuario principal) o asignado (cuenta asociada). Con porcentaje 100 el curso queda COMPLETADO y ya no puede retroceder.',
  })
  @ApiResponse({ status: 200, description: 'Progreso registrado correctamente.' })
  @ApiResponse({ status: 400, description: 'Porcentaje inválido o ID de curso inválido.' })
  @ApiResponse({ status: 403, description: 'El curso no corresponde a esta cuenta, o la cuenta asociada está desactivada.' })
  @ApiResponse({ status: 404, description: 'El curso no existe.' })
  @ApiResponse({ status: 503, description: 'No se pudo conectar con Back Auth o Back Transaction.' })
  async registrar(
    @Param('idCurso', ParseObjectIdPipe) idCurso: string,
    @Body() dtoProgreso: dto.RegistrarProgresoCursoDto,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    const result = await this.registrarUseCase.execute(usuario, idCurso, dtoProgreso);
    if (result.isFailure) lanzarErrorHttp(result.error);
    return { data: result.getValue(), message: 'Progreso registrado correctamente' };
  }
}
