import { PartialType } from '@nestjs/swagger';
import { createProfesorDto } from './create-profesor.dto';


export class updateProfesorDto extends PartialType(createProfesorDto){
}