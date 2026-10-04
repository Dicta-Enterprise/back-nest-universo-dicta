import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { XapiService } from 'src/core/services/xapi/xapi.service';
import { EnviarStatementDto } from 'src/application/dto/xapi/enviar-statement.dto';

@ApiTags('xAPI')
@ApiCookieAuth('accessToken')
@Controller('xapi')
@UseGuards(jwtAuthGuard)
export class XapiController {
  constructor(private readonly xapiService: XapiService) {}

  @Post('statement')
  @ApiOperation({ summary: 'Recibe un evento de aprendizaje simplificado y lo envía al LRS como statement xAPI.' })
  @ApiResponse({ status: 201, description: 'Statement enviado (o motivo por el que no se pudo enviar).' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  async recibirStatement(@Body() dto: EnviarStatementDto, @CurrentUser() usuario) {
    const statement = this.xapiService.construirStatement(usuario, dto);
    const resultado = await this.xapiService.enviarAlLRS(statement);

    return {
      data: resultado,
      message: resultado.ok ? 'Statement enviado al LRS.' : 'No se pudo enviar el statement al LRS.',
    };
  }
}
