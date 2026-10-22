import { Injectable } from '@nestjs/common';
import { PlantillaCertificacion } from 'src/core/entities/plantilla-certificacion/plantilla-certificacion.entity';
import { PlantillasCertificacionService } from 'src/core/services/plantilla-certificacion/plantillas-certificacion.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetOnePlantillaCertificacionUseCase {
  constructor(private readonly service: PlantillasCertificacionService) {}

  async execute(id: string): Promise<Result<PlantillaCertificacion>> {
    try {
      const plantilla = await this.service.obtenerUna(id);
      return Result.ok(plantilla);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
