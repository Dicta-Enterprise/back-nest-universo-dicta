import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateIdiomaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsOptional()
    @IsBoolean()
    estado: boolean;
}
