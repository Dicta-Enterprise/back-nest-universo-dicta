import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaClient } from '@prisma/client';

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


      const categoria = await this.categoria.create({
        data: createCategoriaDto,
      });

      return categoria;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAll() {
    try {
      const categorias = await this.categoria.findMany();
      return categorias;
    } catch (error) {
      throw error;
    }
  }

  findOne(id: string) {
    try {
      const categoria = this.categoria.findUnique({
        where: {
          id: id,
        },
      });
      return categoria;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    console.log(updateCategoriaDto);
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}
