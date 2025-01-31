import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanetaDto } from './create-planeta.dto';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdatePlanetaDto extends PartialType(CreatePlanetaDto) {
  @IsOptional()
  @IsMongoId({ message: 'El ID de la galaxia debe ser un ObjectId válido.' })
  galaxiaId?: string; // <- Agregado aquí y marcado como opcional
}