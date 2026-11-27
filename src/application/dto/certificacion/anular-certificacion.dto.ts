import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AnularCertificacionDto {
  @ApiProperty({
    example: 'Se emitió por error.',
    description:
      'Motivo de la anulación. Queda guardado en la base de datos; no se publica en blockchain ni en la validación pública.',
  })
  @IsString({ message: 'motivo debe ser texto.' })
  @IsNotEmpty({ message: 'motivo es obligatorio.' })
  @MaxLength(500, { message: 'motivo no puede superar 500 caracteres.' })
  motivo: string;
}

export class ReemitirCertificacionDto extends AnularCertificacionDto {
  @ApiPropertyOptional({
    example: 'Sofía Pérez Gómez',
    description:
      'Nombre corregido del titular. Si se omite, el certificado nuevo lleva el mismo nombre que el anterior.',
  })
  @IsOptional()
  @IsString({ message: 'nombreTitular debe ser texto.' })
  @IsNotEmpty({ message: 'nombreTitular no puede estar vacío.' })
  @MaxLength(150, { message: 'nombreTitular no puede superar 150 caracteres.' })
  nombreTitular?: string;
}
