import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoPlantilla, TipoCertificacion } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class FiltrarPlantillasQueryDto {
  @ApiPropertyOptional({
    enum: EstadoPlantilla,
    description: 'Filtra las plantillas por estado.',
  })
  @IsEnum(EstadoPlantilla, { message: 'estado debe ser uno de los valores permitidos.' })
  @IsOptional()
  estado?: EstadoPlantilla;

  @ApiPropertyOptional({
    enum: TipoCertificacion,
    description: 'Filtra las plantillas por tipo de certificación.',
  })
  @IsEnum(TipoCertificacion, {
    message: 'tipoCertificacion debe ser uno de los valores permitidos.',
  })
  @IsOptional()
  tipoCertificacion?: TipoCertificacion;
}
