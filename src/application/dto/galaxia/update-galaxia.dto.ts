import { PartialType } from '@nestjs/swagger';
import { CreateGalaxiaDto } from './create-galaxia.dto';

export class UpdateGalaxiaDto extends PartialType(CreateGalaxiaDto) {}