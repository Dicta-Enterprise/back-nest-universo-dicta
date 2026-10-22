import { Injectable } from '@nestjs/common';
import { UpdatePlantillaCertificacionDto } from 'src/application/dto/plantilla-certificacion';
import { PlantillaCertificacion } from 'src/core/entities/plantilla-certificacion/plantilla-certificacion.entity';
import { PlantillasCertificacionService } from 'src/core/services/plantilla-certificacion/plantillas-certificacion.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class UpdatePlantillaCertificacionUseCase {
  constructor(private readonly service: PlantillasCertificacionService) {}

  async execute(
    id: string,
    dto: UpdatePlantillaCertificacionDto,
  ): Promise<Result<PlantillaCertificacion>> {
    try {
      const plantilla = await this.service.actualizar(id, dto);
      return Result.ok(plantilla);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
