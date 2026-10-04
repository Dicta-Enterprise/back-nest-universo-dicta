import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { BunnyTokenService } from 'src/core/services/bunny/bunny-token.service';

@ApiTags('Bunny')
@ApiCookieAuth('accessToken')
@Controller('bunny')
@UseGuards(jwtAuthGuard)
export class BunnyController {
  constructor(private readonly bunnyTokenService: BunnyTokenService) {}

  @Get('token/:videoId')
  @ApiOperation({ summary: 'Genera un token temporal para reproducir un video de Bunny.net' })
  @ApiResponse({ status: 200, description: 'Token generado con éxito.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  obtenerToken(@Param('videoId') videoId: string) {
    const resultado = this.bunnyTokenService.generarTokenReproduccion(videoId);
    return { data: resultado, message: 'Token generado con éxito.' };
  }
}
