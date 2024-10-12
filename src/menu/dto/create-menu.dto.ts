import { SubMenu } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  nombre: string;

  @IsString()
  ruta: string;

  @IsString()
  @IsNotEmpty()
  icono: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsOptional()
  menu: SubMenu[];
}
