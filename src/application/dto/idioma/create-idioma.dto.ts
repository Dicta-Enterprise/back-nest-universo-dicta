import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIdiomaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  descripcion: string;
}
