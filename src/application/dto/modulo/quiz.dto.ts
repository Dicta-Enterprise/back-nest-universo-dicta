import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class QuizDto {
  @ApiProperty({ example: '¿Cuánto es 2 + 2?' })
  @IsString()
  @IsNotEmpty()
  pregunta: string;

  @ApiProperty({ example: ['3', '4', '5'] })
  @IsArray()
  @IsString({ each: true })
  opciones: string[];

  @ApiProperty({ example: '4' })
  @IsString()
  @IsNotEmpty()
  respuestaCorrecta: string;
}
