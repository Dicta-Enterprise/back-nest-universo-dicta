import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateSubMenuDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  ruta: string;

  @IsString()
  @IsNotEmpty()
  icono: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  ruta: string;

  @IsString()
  @IsNotEmpty()
  icono: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubMenuDto) 
  subMenu: CreateSubMenuDto[]; 
}
