import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AstronautaService,
  TipoAstronautaValido,
  TIPOS_ASTRONAUTA,
} from 'src/core/services/astronauta/astronauta.service';

// Límite generoso (20 MB): los 4 modelos entregados por Jamil pesan ~8 MB cada uno sin
// optimizar -- hay que avisar si llegan más pesados que esto, no subirlo en silencio.
const LIMITE_BYTES = 20 * 1024 * 1024;

@ApiTags('Astronautas')
@Controller('astronautas')
export class AstronautasController {
  constructor(private readonly astronautaService: AstronautaService) {}

  @Get()
  @ApiOperation({ summary: 'Lista los 4 modelos de astronauta (papá, mamá, hijo, hija) y su URL actual' })
  async listar() {
    const data = await this.astronautaService.listar();
    return { data, message: 'Astronautas obtenidos correctamente' };
  }

  @Post(':tipo')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: LIMITE_BYTES } }))
  @ApiOperation({ summary: 'Sube (o reemplaza) el modelo .glb de un tipo de astronauta' })
  async subir(@Param('tipo') tipo: string, @UploadedFile() file: Express.Multer.File) {
    const tipoMayus = tipo.toUpperCase();
    if (!TIPOS_ASTRONAUTA.includes(tipoMayus as TipoAstronautaValido)) {
      throw new BadRequestException(`"tipo" debe ser uno de: ${TIPOS_ASTRONAUTA.join(', ')}`);
    }

    const astronauta = await this.astronautaService.subir(tipoMayus as TipoAstronautaValido, file);
    return { data: astronauta, message: `Astronauta ${tipoMayus} subido correctamente` };
  }
}
