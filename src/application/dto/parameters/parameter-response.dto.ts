import { ParameterItemDto } from './parameters.dto';

export class ParametersResponseDto {
  DP_CATEGORIAS: ParameterItemDto[];
  DP_GALAXIAS: ParameterItemDto[];
  DP_PLANETAS: ParameterItemDto[];
  DP_IDIOMAS: ParameterItemDto[];
  DP_PROFESORES: ParameterItemDto[];
  
  constructor() {
    this.DP_CATEGORIAS = [];
    this.DP_GALAXIAS = [];
    this.DP_PLANETAS = [];
    this.DP_IDIOMAS = [];
    this.DP_PROFESORES = [];
  }
}