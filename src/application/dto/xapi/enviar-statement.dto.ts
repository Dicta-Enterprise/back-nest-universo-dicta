import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

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

  @ApiProperty({ example: '64fd1c2f9a25d8e3f41b9c7a', description: 'Id del curso al que pertenece el módulo.' })
  @IsMongoId()
  @IsNotEmpty()
  cursoId: string;

  @ApiPropertyOptional({ example: 'b7a1f0c2-5d3e-4c1a-9a55-0d1b2c3d4e5f', description: 'Id único del evento generado por el front. Si se reenvía, no se cuenta dos veces.' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  eventoId?: string;

  @ApiPropertyOptional({ example: { porcentaje: 50 }, description: 'Datos extra del evento: { porcentaje } en progressed; { puntaje, total } en passed/failed.' })
  @IsObject()
  @IsOptional()
  resultado?: Record<string, unknown>;
}
