import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class BeneficioDto {
  @ApiProperty({
    example: 'Aprenderás a manejar conflictos',
    description: 'Título del beneficio del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  titulo: string;

  @ApiProperty({
    example: 'Desarrollarás habilidades de comunicación asertiva para resolver conflictos de manera efectiva',
    description: 'Descripción detallada del beneficio',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  descripcion: string;
}
