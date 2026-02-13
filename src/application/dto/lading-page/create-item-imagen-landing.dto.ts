import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, Length } from 'class-validator';

export class CreateItemImagenLandingDto {
  @ApiProperty({
    example: 'https://midominio.com/imagenes/banner-secundario.jpg',
    description: 'URL pública de la imagen asociada a la landing',
  })
  @IsString()
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
  @Length(5, 500)
  url: string;
}
