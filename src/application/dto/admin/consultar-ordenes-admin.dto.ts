import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';

export class ConsultarOrdenesAdminDto {
  @ApiPropertyOptional({ example: 14, description: 'ID del usuario que hizo la compra.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idusuario?: number;

  @ApiPropertyOptional({ example: '2026-10-01', description: 'Órdenes creadas desde esta fecha.' })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional({ example: '2026-10-31', description: 'Órdenes creadas hasta esta fecha.' })
  @IsOptional()
  @IsDateString()
  hasta?: string;

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
