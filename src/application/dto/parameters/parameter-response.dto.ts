import { ApiProperty } from '@nestjs/swagger';
import { ParameterItemDto } from './parameters.dto';

export class ParametersResponseDto {
  @ApiProperty({
    type: [ParameterItemDto],
    description: 'Lista de categorías',
    example: [
      {
        id: '689e12c5bb9772d4bb7b983e',
        value: 'Jovenes',
        code: 'P_CATE_JOVENES'
      }
    ]
  })
  DP_CATEGORIAS: ParameterItemDto[];

  @ApiProperty({
    type: [ParameterItemDto],
    description: 'Lista de galaxias',
    example: [
      {
        id: 1,
        value: 'Vía Láctea',
        code: 'P_GALA_VIA_LACTEA'
      }
    ]
  })
  DP_GALAXIAS: ParameterItemDto[];

  @ApiProperty({
    type: [ParameterItemDto],
    description: 'Lista de planetas',
    example: [
      {
        id: 1,
        value: 'Tierra',
        code: 'P_PLAN_TIERRA'
      }
    ]
  })
  DP_PLANETAS: ParameterItemDto[];

  @ApiProperty({
    type: [ParameterItemDto],
    description: 'Lista de idiomas',
    example: [
      {
        id: 1,
        value: 'Español',
        code: 'P_IDIO_ESPANOL'
      }
    ]
  })
  DP_IDIOMAS: ParameterItemDto[];

  @ApiProperty({
    type: [ParameterItemDto],
    description: 'Lista de profesores',
    example: [
      {
        id: 1,
        value: 'Juan Pérez García',
        code: 'P_PROF_JUAN_PEREZ_GARCIA'
      }
    ]
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