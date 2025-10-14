import { ApiProperty } from '@nestjs/swagger';
import { ParameterDto } from './parameter.dto';

// DTO que define la estructura de respuesta consolidada del endpoint /parameters
// y conteniene las listas de ParameterDto para cada catalogo.
export class GetAllParametersResponseDto {
    @ApiProperty({ type: [ParameterDto] })
    DP_CATEGORIAS: ParameterDto[];

    @ApiProperty({ type: [ParameterDto] })
    DP_GALAXIAS: ParameterDto[];

    @ApiProperty({ type: [ParameterDto] })
    DP_PLANETAS: ParameterDto[];
}