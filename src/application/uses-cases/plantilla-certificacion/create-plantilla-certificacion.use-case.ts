import { Injectable } from '@nestjs/common';
import { CreatePlantillaCertificacionDto } from 'src/application/dto/plantilla-certificacion';
import { PlantillaCertificacion } from 'src/core/entities/plantilla-certificacion/plantilla-certificacion.entity';
import { PlantillasCertificacionService } from 'src/core/services/plantilla-certificacion/plantillas-certificacion.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class CreatePlantillaCertificacionUseCase {
  constructor(private readonly service: PlantillasCertificacionService) {}

  async execute(
    dto: CreatePlantillaCertificacionDto,
  ): Promise<Result<PlantillaCertificacion>> {
    try {
      const plantilla = await this.service.crear(dto);
      return Result.ok(plantilla);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
