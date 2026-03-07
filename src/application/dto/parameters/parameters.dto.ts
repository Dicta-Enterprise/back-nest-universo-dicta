import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { PaginationDto } from '../pagination/pagination.dto';

export class GetParametersPaginationDto extends PaginationDto {
  @ApiProperty({
    description: 'Tipo de parámetro a obtener',
    example: 'DP_CATEGORIAS',
    required: false,
    enum: ['DP_CATEGORIAS', 'DP_GALAXIAS', 'DP_PLANETAS', 'DP_IDIOMAS', 'DP_PROFESORES']
  })
  @IsOptional()
  @IsString()
  @Matches(/^DP_[A-Z_]+$/, {
    message: 'El tipo debe tener el formato DP_ seguido de letras mayúsculas y guiones bajos'
  })
  type?: string;
}