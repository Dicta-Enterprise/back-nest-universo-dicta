import { PartialType } from '@nestjs/swagger';
import { CreatePlanetaDto } from './create-planeta.dto';

export class UpdatePlanetaDto extends PartialType(CreatePlanetaDto) {}
