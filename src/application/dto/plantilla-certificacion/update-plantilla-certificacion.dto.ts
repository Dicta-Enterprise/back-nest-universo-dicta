import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePlantillaCertificacionDto } from './create-plantilla-certificacion.dto';

export class UpdatePlantillaCertificacionDto extends PartialType(
  OmitType(CreatePlantillaCertificacionDto, ['estado'] as const),
) {}
