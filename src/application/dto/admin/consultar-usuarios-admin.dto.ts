import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export const ROLES_USUARIO_FILTRO = ['PADRE', 'NINO', 'JOVEN'] as const;
export const FILTRO_COMPRO = ['si', 'no'] as const;
export const ESTADOS_USUARIO_FILTRO =['ACTIVA', 'PENDIENTE', 'INACTIVA', 'BLOQUEADA'] as const;

export class ConsultarUsuariosAdminDto {
  @ApiPropertyOptional({ example: 'sofia', description: 'Busca en nombre, correo, código y nombre de familia.' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ example: 'USR-N-032', description: 'ID del usuario (USR-P/N/J-000) o de la familia (FAM-000).' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  id?: string;

  @ApiPropertyOptional({ enum: ROLES_USUARIO_FILTRO })
  @IsOptional()
  @IsIn(ROLES_USUARIO_FILTRO)
  rol?: (typeof ROLES_USUARIO_FILTRO)[number];

  @ApiPropertyOptional({ enum: ESTADOS_USUARIO_FILTRO })
  @IsOptional()
  @IsIn(ESTADOS_USUARIO_FILTRO)
  estado?: (typeof ESTADOS_USUARIO_FILTRO)[number];

  @ApiPropertyOptional({ example: 'FAM-014', description: 'Código, número o parte del nombre de la familia.' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  familia?: string;

  @ApiPropertyOptional({ example: '2026-10-01', description: 'Registrados desde esta fecha.' })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional({ example: '2026-10-31', description: 'Registrados hasta esta fecha.' })
  @IsOptional()
  @IsDateString()
  hasta?: string;

  @ApiPropertyOptional({ enum: FILTRO_COMPRO, description: 'si: solo quienes ya compraron. no: solo quienes no han comprado. Aplica a padres.' })
  @IsOptional()
  @IsIn(FILTRO_COMPRO)
  compro?: (typeof FILTRO_COMPRO)[number];

  @ApiPropertyOptional({ example: '2026-10-01', description: 'Primera compra desde esta fecha (implica que ya compró).' })
  @IsOptional()
  @IsDateString()
  compraDesde?: string;

  @ApiPropertyOptional({ example: '2026-10-31', description: 'Primera compra hasta esta fecha (implica que ya compró).' })
  @IsOptional()
  @IsDateString()
  compraHasta?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20, default: 20, description: 'Máximo 100.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
