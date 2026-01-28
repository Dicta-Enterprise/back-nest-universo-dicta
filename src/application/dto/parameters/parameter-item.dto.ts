import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParameterItemDto {
  @ApiProperty({
    description: 'ID del parámetro',
    example: '689e12c5bb9772d4bb7b983e',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'Valor del parámetro',
    example: 'Jóvenes',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: 'Código del parámetro',
    example: 'P_CATE_JOVENES',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;
}
