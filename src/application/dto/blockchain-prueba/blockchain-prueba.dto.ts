import { ApiProperty } from '@nestjs/swagger';
import { TipoCertificacion } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegistrarCertificadoPruebaDto {
  @ApiProperty({
    example: 'CERT-2026-A1B2C3D4E5',
    description: 'Código del certificado. Si se repite, devuelve el registro anterior en vez de crear otro.',
  })
  @IsString({ message: 'codigoCertificado debe ser texto.' })
  @IsNotEmpty({ message: 'codigoCertificado es obligatorio.' })
  @MaxLength(50, { message: 'codigoCertificado no puede superar 50 caracteres.' })
  codigoCertificado: string;

  @ApiProperty({
    enum: TipoCertificacion,
    example: TipoCertificacion.NINO,
    description: 'Tipo de certificado. Solo RECONOCIMIENTO (adultos) sube el nombre a IPFS.',
  })
  @IsEnum(TipoCertificacion, {
    message: 'tipoCertificacion debe ser RECONOCIMIENTO, JOVEN o NINO.',
  })
  tipoCertificacion: TipoCertificacion;

  @ApiProperty({
    example: 'Ciberbullying',
    description: 'Nombre del curso.',
  })
  @IsString({ message: 'nombreCurso debe ser texto.' })
  @IsNotEmpty({ message: 'nombreCurso es obligatorio.' })
  @MaxLength(150, { message: 'nombreCurso no puede superar 150 caracteres.' })
  nombreCurso: string;

  @ApiProperty({
    example: 'Sofía Pérez',
    description: 'Nombre del titular.',
  })
  @IsString({ message: 'nombreTitular debe ser texto.' })
  @IsNotEmpty({ message: 'nombreTitular es obligatorio.' })
  @MaxLength(150, { message: 'nombreTitular no puede superar 150 caracteres.' })
  nombreTitular: string;

  @ApiProperty({
    example: 'blockchain@gmail.com',
    description: 'Email con el que Privy crea o encuentra la wallet que recibe el certificado.',
  })
  @IsEmail({}, { message: 'emailTitular debe ser un email válido.' })
  emailTitular: string;
}

export class RevocarCertificadoPruebaDto {
  @ApiProperty({
    example: 'Anulación por error en los datos',
    description: 'Motivo de la anulación. Queda registrado en la blockchain.',
  })
  @IsString({ message: 'motivo debe ser texto.' })
  @IsNotEmpty({ message: 'motivo es obligatorio.' })
  @MaxLength(200, { message: 'motivo no puede superar 200 caracteres.' })
  motivo: string;
}

export class ReemitirCertificadoPruebaDto extends RegistrarCertificadoPruebaDto {
  @ApiProperty({
    example: 'Corrección del nombre del titular',
    description: 'Motivo de la reemisión. Queda registrado en la blockchain.',
  })
  @IsString({ message: 'motivo debe ser texto.' })
  @IsNotEmpty({ message: 'motivo es obligatorio.' })
  @MaxLength(200, { message: 'motivo no puede superar 200 caracteres.' })
  motivo: string;
}
