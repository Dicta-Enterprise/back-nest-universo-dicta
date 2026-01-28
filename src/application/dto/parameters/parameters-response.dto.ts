import { ApiProperty } from '@nestjs/swagger';
import { ParameterItemDto } from './parameter-item.dto';

export class ParametersResponseDto {
  @ApiProperty({
    type: [ParameterItemDto],
    description: 'Lista de categorías',
  })
  DP_CATEGORIAS: ParameterItemDto[];

  @ApiProperty({
    type: [ParameterItemDto],
    description: 'Lista de galaxias',
  })
  DP_GALAXIAS: ParameterItemDto[];

  @ApiProperty({
    type: [ParameterItemDto],
    description: 'Lista de planetas',
  })
  DP_PLANETAS: ParameterItemDto[];

  @ApiProperty({
    type: [ParameterItemDto],
    description: 'Lista de idiomas',
  })
  DP_IDIOMAS: ParameterItemDto[];

  @ApiProperty({
    type: [ParameterItemDto],
    description: 'Lista de profesores',
  })
  DP_PROFESORES: ParameterItemDto[];

  constructor() {
    this.DP_CATEGORIAS = [];
    this.DP_GALAXIAS = [];
    this.DP_PLANETAS = [];
    this.DP_IDIOMAS = [];
    this.DP_PROFESORES = [];
  }
}
