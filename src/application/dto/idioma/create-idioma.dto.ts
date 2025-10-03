import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIdiomaDto {
  @ApiProperty({
    example: 'Español',
    description: 'Nombre del idioma',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @ApiProperty({
    example: true,
    description: 'Estado del idioma (activo/inactivo)',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  estado: boolean;
}
