import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { ConsultarProgresoDto } from 'src/application/dto/progreso/consultar-progreso.dto';
import { ProgresoLecturaService } from 'src/core/services/progreso-modulo/progreso-lectura.service';

const SIETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags('Progreso')
@ApiCookieAuth('accessToken')
@Controller('progreso')
@UseGuards(jwtAuthGuard)
export class ProgresoController {
  constructor(private readonly progresoLecturaService: ProgresoLecturaService) {}

  @Get()
  @ApiOperation({
    summary: 'Resumen de progreso por familia y estudiante. El administrador ve todas las familias; un padre solo la suya.',
  })
  @ApiResponse({ status: 200, description: 'Resumen de progreso.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 502, description: 'El servicio de autenticación respondió con un error.' })
  @ApiResponse({ status: 503, description: 'No se pudo conectar con el servicio de autenticación.' })
  async obtenerProgreso(@Query() query: ConsultarProgresoDto, @CurrentUser() usuario) {
    const hasta = query.hasta ? new Date(query.hasta) : new Date();
    const desde = query.desde ? new Date(query.desde) : new Date(hasta.getTime() - SIETE_DIAS_MS);

    if (desde > hasta) {
      throw new BadRequestException('"desde" no puede ser posterior a "hasta".');
    }

    const resumen = await this.progresoLecturaService.obtenerResumen(usuario, { desde, hasta });
    return { data: resumen, message: 'Resumen de progreso obtenido con éxito.' };
  }
}
