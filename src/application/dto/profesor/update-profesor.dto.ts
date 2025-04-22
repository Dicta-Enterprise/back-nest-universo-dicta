import { PartialType } from "@nestjs/mapped-types";
import { createProfesorDto } from "./create-profesor.dto";


export class updateProfesorDto extends PartialType(createProfesorDto){
}