import { BadRequestException, Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { ProgresoModuloService } from 'src/core/services/progreso-modulo/progreso-modulo.service';
import { XapiService } from 'src/core/services/xapi/xapi.service';
import { EnviarStatementDto } from 'src/application/dto/xapi/enviar-statement.dto';

@ApiTags('xAPI')
@ApiCookieAuth('accessToken')
@Controller('xapi')
@UseGuards(jwtAuthGuard)
export class XapiController {
  private readonly logger = new Logger(XapiController.name);

  constructor(
    private readonly xapiService: XapiService,
    private readonly progresoService: ProgresoModuloService,
  ) {}

  @Post('statement')
  @ApiOperation({ summary: 'Recibe un evento de aprendizaje, actualiza el resumen de progreso y lo envía al LRS como statement xAPI.' })
  @ApiResponse({ status: 201, description: 'Statement enviado (o motivo por el que no se pudo enviar).' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  async recibirStatement(@Body() dto: EnviarStatementDto, @CurrentUser() usuario) {
    const usuarioId = Number(usuario.sub);
    if (!Number.isInteger(usuarioId)) {
      throw new BadRequestException('El token no trae un id de usuario válido.');
    }

    // Primero se guarda el resumen en nuestra base: si el LRS falla, el progreso no se pierde.
    let progresoGuardado = true;
    try {
      await this.progresoService.registrarEvento({
        usuarioId,
        cursoId: dto.cursoId,
        moduloId: dto.moduloId,
        tipo: dto.tipo,
        eventoId: dto.eventoId,
        resultado: dto.resultado,
      });
    } catch (error) {
      progresoGuardado = false;
      this.logger.error('No se pudo guardar el resumen de progreso.', error as Error);
    }

    const statement = this.xapiService.construirStatement(usuario, dto);
    const resultado = await this.xapiService.enviarAlLRS(statement);

    return {
      data: { ...resultado, progresoGuardado },
      message: resultado.ok ? 'Statement enviado al LRS.' : 'No se pudo enviar el statement al LRS.',
    };
  }
}
