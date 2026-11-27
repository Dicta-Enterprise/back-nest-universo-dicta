import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class EmitirCertificacionDto {
  @ApiProperty({
    example: '66f1c2a4e1b2c3d4e5f6a7b8',
    description: 'ID (ObjectId de Mongo) del curso completado.',
  })
  @IsMongoId({ message: 'idCurso debe ser un ObjectId válido.' })
  idCurso: string;

  @ApiPropertyOptional({
    example: 12,
    description:
      'ID de la cuenta asociada (hijo) a la que se le emite el certificado. Si se omite, el certificado es del usuario principal.',
  })
  @IsOptional()
  @IsInt({ message: 'idCuentaAsociada debe ser un número entero.' })
  @Min(1, { message: 'idCuentaAsociada debe ser mayor a 0.' })
  idCuentaAsociada?: number;

  @ApiProperty({
    example: 'Sofía Pérez',
    description:
      'Nombre y apellido tal como aparecerán en el certificado. El padre los confirma antes de emitir: después solo un administrador puede corregirlos, reemitiendo el certificado.',
  })
  @IsString({ message: 'nombreTitular debe ser texto.' })
  @IsNotEmpty({ message: 'nombreTitular es obligatorio.' })
  @MaxLength(150, { message: 'nombreTitular no puede superar 150 caracteres.' })
  nombreTitular: string;
}
