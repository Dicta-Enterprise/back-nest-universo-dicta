import { Injectable } from '@nestjs/common';
import { PlantillasCertificacionService } from 'src/core/services/plantilla-certificacion/plantillas-certificacion.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class DeletePlantillaCertificacionUseCase {
  constructor(private readonly service: PlantillasCertificacionService) {}

  async execute(id: string): Promise<Result<void>> {
    try {
      await this.service.eliminar(id);
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }
}
