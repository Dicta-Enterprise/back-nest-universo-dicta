import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaClient } from '@prisma/client';
import { GenericSingle } from 'src/shared/class/Generic.Class';
import { CustomError } from 'src/shared/class/Error.Class';

@Injectable()
export class MenuService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  constructor() {
    super();
  }

  async create(createMenuDto: CreateMenuDto) {
    try {
      const menuExist = await this.menu.findFirst({
        where: {
          nombre: createMenuDto.nombre,
        },
      });

      if (menuExist) {
        return new GenericSingle(
          'error',
          HttpStatus.CONFLICT,
          'El menú ya existe',
        );
      }
      const menu = await this.menu.create({
        data: {
          nombre: createMenuDto.nombre,
          icono: createMenuDto.icono,
          color: createMenuDto.color,
          ruta: createMenuDto.ruta, 
          submenus: {
            create: createMenuDto.subMenu.map(sub => ({
              nombre: sub.nombre,
              icono: sub.icono,
              color: sub.color,
              ruta: sub.ruta,
            })),
          },
        },
      });

      return new GenericSingle(menu, HttpStatus.CREATED, 'success');
    } catch (error) {
      return new GenericSingle(
        'error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  async findAll() {
    try {
      const menu = await this.menu.findMany({
        where: {
          estado: 'ACTIVO',
        },
      });

      if (!menu) {
        return new GenericSingle(
          'error',
          HttpStatus.NOT_FOUND,
          'No se encontraron registros',
        );
      }

      return new GenericSingle(menu, HttpStatus.OK, 'success');
    } catch (error) {
      throw new CustomError(
        null,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const menu = await this.menu.findUnique({
        where: {
          id: id,
        },
      });

      return new GenericSingle(menu, HttpStatus.OK, 'success');
    } catch (error) {
      throw new CustomError(
        null,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    try {
      const menu = await this.menu.update({
        where: {
          id: id,
        },
        data: updateMenuDto,
      });

      if (!menu) {
        return new GenericSingle(
          'error',
          HttpStatus.NOT_FOUND,
          'No se encontraron registros',
        );
      }

      return new GenericSingle(menu, HttpStatus.OK, 'success');
    } catch (error) {
      throw new CustomError(
        null,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: string) {
    return `This action removes a #${id} menu`;
  }
}
