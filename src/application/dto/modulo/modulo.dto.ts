import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { QuizDto } from './quiz.dto';

export class ModuloDto {
  @ApiProperty({ example: 'Módulo 1 - Introducción' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'a1b2c3d4e5f6g7h8', description: 'Id del video en Bunny.net (no el archivo en sí).' })
  @IsString()
  @IsNotEmpty()
  bunnyVideoId: string;

  @ApiProperty({ example: 1, description: 'Orden del módulo dentro del curso.' })
  @IsInt()
  @Min(1)
  orden: number;

  @ApiPropertyOptional({ type: [QuizDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizDto)
  quizzes?: QuizDto[];
}
