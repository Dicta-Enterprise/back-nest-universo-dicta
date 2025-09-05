  
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class BeneficioLiteDto {
  @ApiProperty()
  @Expose()
  titulo: string;

  @ApiProperty()
  @Expose()
  descripcion: string;
}

export class CursoLiteDto {
  @ApiProperty() @Expose() id: string | number;
  @ApiProperty() @Expose() nombre: string;
  @ApiProperty() @Expose() descripcion: string;

  @ApiProperty({ enum: ['todos', 'ninos', 'jovenes', 'padres'] })
  @Expose()
  @Transform(({ obj }) => {
    const raw = (obj?.categoria?.nombre ?? 'todos') 
      .toString()
      .toLowerCase();
    if (raw.includes('niño') || raw.includes('nino')) return 'ninos';
    if (raw.includes('joven')) return 'jovenes';
    if (raw.includes('padre')) return 'padres';
    return 'todos';
  })
  categoria: 'todos' | 'ninos' | 'jovenes' | 'padres';

  @ApiProperty({ type: [BeneficioLiteDto] })
  @Expose()
  @Type(() => BeneficioLiteDto)
  beneficios: BeneficioLiteDto[];

  @ApiProperty() @Expose() imagen: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => Number(obj?.precio ?? 0))
  precio: number;
}
