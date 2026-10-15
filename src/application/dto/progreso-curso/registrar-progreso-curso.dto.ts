import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class RegistrarProgresoCursoDto {
  @ApiProperty({
    example: 100,
    description: 'Porcentaje de avance del curso, de 0 a 100. Con 100 el curso queda completado.',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber({}, { message: 'porcentaje debe ser un número.' })
  @Min(0, { message: 'porcentaje no puede ser menor a 0.' })
  @Max(100, { message: 'porcentaje no puede ser mayor a 100.' })
  porcentaje: number;
}
