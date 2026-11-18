import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegistrarReclamoAdminDto {
  @ApiProperty({ example: 'El usuario dice que no le llegó el acceso al curso.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  descripcion: string;
}
