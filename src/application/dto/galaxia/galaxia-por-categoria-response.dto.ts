import { ApiProperty } from '@nestjs/swagger';
import { Galaxia3DResponseDto } from './response-galaxia.dto';

export class GalaxiasPorCategoriaResponseDto {
  @ApiProperty({ 
    example: 'niños', 
    description: 'Nombre de la categoría' 
  })
  categoria: string;

  @ApiProperty({ 
    type: [Galaxia3DResponseDto],
    description: 'Lista de galaxias formateadas para motor 3D'
  })
  galaxias: Galaxia3DResponseDto[];

  @ApiProperty({ 
    example: 4, 
    description: 'Total de galaxias en la categoría' 
  })
  total: number;
}