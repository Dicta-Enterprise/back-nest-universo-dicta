import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaClient } from '@prisma/client';
import { GenericArray, GenericSingle } from 'src/shared/class/Generic.Class';

@Injectable()
export class CategoriasService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Categorias Service');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to MongoDb');
  }

  constructor() {
    super();
  }

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      const oneCategoria = await this.categoria.findUnique({
        where: {
          nombre: createCategoriaDto.nombre,
        },
      });

      if (oneCategoria) {
        return new GenericSingle(
          oneCategoria,
          HttpStatus.BAD_REQUEST,
          'La categoría ya existe',
        );
      }

      const categoria = await this.categoria.create({
        data: createCategoriaDto,
      });

      return new GenericSingle(
        categoria,
        HttpStatus.CREATED,
        'Categoría creada',
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAll() {
    try {
      const categorias = await this.categoria.findMany({
        where: {
          estado: 'ACTIVO',
        },
      });
      return new GenericArray(
        categorias,
        HttpStatus.OK,
        'Categorías encontradas',
      );
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const categoria = await this.categoria.findUnique({
        where: {
          id: id,
        },
      });
      return new GenericSingle(
        categoria,
        HttpStatus.OK,
        'Categoría encontrada',
      );
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    try {
      const categoria = await this.categoria.update({
        where: {
          id: id,
        },
        data: updateCategoriaDto,
      });

      if (!categoria) {
        return new GenericSingle(
          categoria,
          HttpStatus.NOT_FOUND,
          'La categoría no existe',
        );
      }

      return new GenericSingle(
        categoria,
        HttpStatus.OK,
        'Categoría actualizada',
      );
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const categoria = await this.categoria.update({
        where: {
          id: id,
        },
        data: {
          estado: 'INACTIVO', // Aquí actualizamos la propiedad 'estado' a false
        },
      });
      if (!categoria) {
        return new GenericSingle(
          categoria,
          HttpStatus.NOT_FOUND,
          'La categoría no existe',
        );
      }

      return new GenericSingle(categoria, HttpStatus.OK, 'Categoría eliminada');
    } catch (error) {
      throw error;
    }
  }
}
