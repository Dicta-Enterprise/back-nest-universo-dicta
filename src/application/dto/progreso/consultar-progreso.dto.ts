import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class ConsultarProgresoDto {
  @ApiPropertyOptional({ example: '2026-10-01', description: 'Inicio del periodo para contar familias activas. Por defecto, hace 7 días.' })
  @IsDateString()
  @IsOptional()
  desde?: string;

  @ApiPropertyOptional({ example: '2026-10-08', description: 'Fin del periodo para contar familias activas. Por defecto, ahora.' })
  @IsDateString()
  @IsOptional()
  hasta?: string;
}
