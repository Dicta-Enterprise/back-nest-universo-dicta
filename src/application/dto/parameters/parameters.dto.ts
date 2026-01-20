import { ApiProperty } from '@nestjs/swagger';

export class ParameterItemDto {
  @ApiProperty({
    description: 'ID del parámetro',
    example: '689e12c5bb9772d4bb7b983e',
    oneOf: [
      { type: 'string', example: '689e12c5bb9772d4bb7b983e' },
      { type: 'number', example: 1 }
    ]
  })
  id: string | number;

  @ApiProperty({
    description: 'Valor del parámetro',
    example: 'Jovenes'
  })
  value: string;

  @ApiProperty({
    description: 'Código generado del parámetro',
    example: 'P_CATE_JOVENES'
  })
  code: string; 

  constructor(id: string | number, value: string, code: string = '') {
    this.id = id;
    this.value = value;
    this.code = code; 
  }
}