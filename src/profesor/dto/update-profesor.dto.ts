import { PartialType } from '@nestjs/swagger';
import { CreateProfesorDto } from './create-profesor.dto';

export class UpdateProfesorDto extends PartialType(CreateProfesorDto) {}
