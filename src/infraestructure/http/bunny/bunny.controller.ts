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

  // TODO: pendiente conectar con la libreria real del modulo (BunnyStreamService.resolverLibreria)
  // y con la verificacion de compra antes de generar el token -- ver explicacion de opciones
  // de paywall pendiente de decision del equipo.
  @Get('token/:videoId/:bunnyLibraryId/:apiKeyLibreria')
  @ApiOperation({ summary: 'Genera un token temporal para reproducir un video de Bunny.net' })
  @ApiResponse({ status: 200, description: 'Token generado con éxito.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  obtenerToken(
    @Param('videoId') videoId: string,
    @Param('bunnyLibraryId') bunnyLibraryId: string,
    @Param('apiKeyLibreria') apiKeyLibreria: string,
  ) {
    const resultado = this.bunnyTokenService.generarTokenReproduccion(videoId, bunnyLibraryId, apiKeyLibreria);
    return { data: resultado, message: 'Token generado con éxito.' };
  }
}
