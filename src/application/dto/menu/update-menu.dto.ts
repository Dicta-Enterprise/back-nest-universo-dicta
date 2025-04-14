import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDto } from './create-menu.dto';
import { EstadoGenerico } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {


    @IsEnum(EstadoGenerico, {
        message:
          'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
      })
    estado: EstadoGenerico;
}
