import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { BunnyStorageService, ZONA_TEXTURAS } from 'src/shared/services/bunny-storage.service';

export const TIPOS_ASTRONAUTA = ['PAPA', 'MAMA', 'HIJO', 'HIJA'] as const;
export type TipoAstronautaValido = (typeof TIPOS_ASTRONAUTA)[number];

// Reutiliza la zona de texturas (no hay todavía una zona de Bunny dedicada a modelos 3D --
// pendiente de pedirle una a Carlos si se quiere separar más adelante, ver nota en
// bunny-storage.service.ts sobre la Pull Zone). La ruta usa siempre el mismo nombre por tipo
// (astronautas/papa.glb, etc.) a propósito: subir uno nuevo SOBRESCRIBE el archivo anterior en
// Bunny, así nunca quedan versiones viejas huérfanas ocupando espacio.
@Injectable()
export class AstronautaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bunny: BunnyStorageService,
  ) {}

  async listar() {
    return this.prisma.astronauta.findMany({ orderBy: { tipo: 'asc' } });
  }

  async subir(tipo: TipoAstronautaValido, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Falta el archivo .glb.');
    }
    if (!file.originalname.toLowerCase().endsWith('.glb')) {
      throw new BadRequestException('Solo se aceptan archivos .glb.');
    }

    const ruta = `astronautas/${tipo.toLowerCase()}.glb`;
    const url = await this.bunny.subirArchivo(ZONA_TEXTURAS, ruta, file.buffer, 'model/gltf-binary');

    return this.prisma.astronauta.upsert({
      where: { tipo },
      create: { tipo, nombreArchivo: file.originalname, url, pesoBytes: file.size },
      update: { nombreArchivo: file.originalname, url, pesoBytes: file.size },
    });
  }
}
