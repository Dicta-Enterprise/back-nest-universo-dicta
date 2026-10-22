import { Injectable } from '@nestjs/common';
import { PlantillaCertificacion } from 'src/core/entities/plantilla-certificacion/plantilla-certificacion.entity';
import { FiltrosPlantillaCertificacion } from 'src/core/repositories/plantilla-certificacion/plantilla-certificacion.repository';
import { PlantillasCertificacionService } from 'src/core/services/plantilla-certificacion/plantillas-certificacion.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetAllPlantillasCertificacionUseCase {
  constructor(private readonly service: PlantillasCertificacionService) {}

  async execute(
    filtros?: FiltrosPlantillaCertificacion,
  ): Promise<Result<PlantillaCertificacion[]>> {
    try {
      const plantillas = await this.service.listar(filtros);
      return Result.okList(plantillas);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
