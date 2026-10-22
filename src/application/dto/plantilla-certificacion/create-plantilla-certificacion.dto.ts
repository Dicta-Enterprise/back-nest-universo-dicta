import { ApiProperty } from '@nestjs/swagger';
import { EstadoPlantilla, TipoCertificacion } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePlantillaCertificacionDto {
  @ApiProperty({
    example: 'Certificado de Reconocimiento 2026',
    description: 'Nombre de la plantilla de certificación.',
  })
  @MinLength(2, { message: 'El nombre debe tener más de 1 carácter.' })
  @MaxLength(150, { message: 'El nombre debe tener menos de 150 caracteres.' })
  @IsString({ message: 'El nombre debe ser un dato de tipo String.' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío.' })
  nombre: string;

  @ApiProperty({
    example: 'Plantilla utilizada para certificados de reconocimiento en cursos generales.',
    description: 'Descripción de la plantilla.',
    required: false,
  })
  @MaxLength(500, { message: 'La descripción debe tener menos de 500 caracteres.' })
  @IsString({ message: 'La descripción debe ser un dato de tipo String.' })
  @IsOptional()
  descripcion?: string;

  @ApiProperty({
    enum: TipoCertificacion,
    example: TipoCertificacion.RECONOCIMIENTO,
    description: 'Tipo de certificación al que aplica esta plantilla.',
  })
    @Transform(({ value }) =>
    typeof value === 'string'
      ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
      : value,
  )

  @IsEnum(TipoCertificacion, {
    message: 'tipoCertificacion debe ser uno de los valores permitidos.',
  })
  @IsNotEmpty({ message: 'tipoCertificacion no debe estar vacío.' })
  tipoCertificacion: TipoCertificacion;

  @ApiProperty({
    example: 'https://storage.azure.com/plantillas/reconocimiento-base.pdf',
    description: 'URL del archivo base de la plantilla.',
  })
  @IsUrl({}, { message: 'urlPlantilla debe ser una URL válida.' })
  @IsNotEmpty({ message: 'urlPlantilla no debe estar vacío.' })
  urlPlantilla: string;

  @ApiProperty({
    example: { colorFondo: '#FFFFFF', logoUrl: 'https://...', textoBase: 'Otorgado a' },
    description:
      'Configuración dinámica de la plantilla en formato JSON (la forma varía según el tipo de certificación).',
  })
  @IsObject({ message: 'configuracion debe ser un objeto JSON válido.' })
  @IsNotEmptyObject({}, { message: 'configuracion no debe estar vacío.' })
  configuracion: Record<string, unknown>;

  @ApiProperty({
    enum: EstadoPlantilla,
    example: EstadoPlantilla.ACTIVA,
    description: 'Estado inicial de la plantilla. Si no se envía, se asume ACTIVA.',
    required: false,
  })
  @IsEnum(EstadoPlantilla, { message: 'estado debe ser uno de los valores permitidos.' })
  @IsOptional()
  estado?: EstadoPlantilla;
}
