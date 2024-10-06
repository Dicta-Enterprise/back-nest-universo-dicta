import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanetaDto } from './create-planeta.dto';

export class UpdatePlanetaDto extends PartialType(CreatePlanetaDto) {}
