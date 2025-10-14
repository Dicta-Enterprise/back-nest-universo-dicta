import { ApiProperty } from '@nestjs/swagger';
//DTO que se utiliza en las listas de los catálogos consolidados.
export class ParameterDto {
    @ApiProperty({ example: 'uuid-de-ejemplo', description: 'ID del parámetro' })
    id: string;

    @ApiProperty({ example: 'Valor del Parámetro', description: 'Nombre visible del parámetro' })
    value: string;
}