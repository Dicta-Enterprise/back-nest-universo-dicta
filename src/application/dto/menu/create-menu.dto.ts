import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateSubMenuDto {
  @ApiProperty({
    example: 'Crear Nuevo Curso',
    description: 'Nombre del submenú',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: 'ninos/crear',
    description: 'Ruta de navegación del submenú',
  })
  @IsString()
  @IsNotEmpty()
  ruta: string;

  @ApiProperty({
    example: 'pi pi-save',
    description: 'Nombre del icono del submenú',
  })
  @IsString()
  @IsNotEmpty()
  icono: string;

  @ApiProperty({
    example: '#fff',
    description: 'Color del submenú en formato hexadecimal',
  })
  @IsString()
  @IsNotEmpty()
  color: string;
}

export class CreateMenuDto {
  @ApiProperty({
    example: 'Cursos',
    description: 'Nombre del menú principal',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: '/cursos',
    description: 'Ruta de navegación del menú principal',
    required: false,
  })
  @IsString()
  @IsOptional()
  ruta: string;

  @ApiProperty({
    example: 'pi pi-book',
    description: 'Nombre del icono del menú principal',
  })
  @IsString()
  @IsNotEmpty()
  icono: string;

  @ApiProperty({
    example: '#222',
    description: 'Color del menú principal en formato hexadecimal',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    example: [
      {
        nombre: 'Nuevo Curso',
        ruta: '/nuevo-curso',
        icono: 'book',
        color: '#fff',
      },
      {
        nombre: 'Progreso',
        ruta: '/progreso',
        icono: 'chart',
        color: '#222',
      },
    ],
    description: 'Array de submenús',
    type: [CreateSubMenuDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubMenuDto)
  subMenu: CreateSubMenuDto[];
}
