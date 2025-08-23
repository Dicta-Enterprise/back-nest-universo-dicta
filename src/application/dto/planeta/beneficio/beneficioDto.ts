import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

const trim = ({ value }: { value: any }) =>
  typeof value === 'string' ? value.trim() : value;

export class BeneficioDto {
  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  descripcion: string;
}
