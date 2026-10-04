import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export const VERBOS_XAPI = [
  'initialized',
  'progressed',
  'passed',
  'failed',
  'interacted',
  'resumed',
  'mastered',
  'suspended',
  'completed',
] as const;

export type VerboXapi = (typeof VERBOS_XAPI)[number];

export class EnviarStatementDto {
  @ApiProperty({ example: 'progressed', enum: VERBOS_XAPI })
  @IsIn(VERBOS_XAPI)
  tipo: VerboXapi;

  @ApiProperty({ example: '64fd1c2f9a25d8e3f41b9c7a', description: 'Id del módulo del curso.' })
  @IsMongoId()
  @IsNotEmpty()
  moduloId: string;

  @ApiPropertyOptional({ example: '64fd1c2f9a25d8e3f41b9c7a', description: 'Id del curso al que pertenece el módulo.' })
  @IsMongoId()
  @IsOptional()
  cursoId?: string;

  @ApiPropertyOptional({ example: { porcentaje: 50 }, description: 'Datos extra del evento (porcentaje de video, puntaje de quiz, etc.).' })
  @IsObject()
  @IsOptional()
  resultado?: Record<string, unknown>;
}
