import { PartialType } from '@nestjs/mapped-types';
import { CreateGalaxiaDto } from './create-galaxia.dto';

export class UpdateGalaxiaDto extends PartialType(CreateGalaxiaDto) {}
