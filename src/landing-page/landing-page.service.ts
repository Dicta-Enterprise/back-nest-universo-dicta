import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateLandingPageDto } from './dto/create-landing-page.dto';
import { CustomError } from 'src/shared/class/Error.Class';
import { GenericArray, GenericSingle } from 'src/shared/class/Generic.Class';
import { PrismaClient } from '@prisma/client';
import { UpdateLandingPageDto } from './dto/update-landing-page';

@Injectable()
export class LandingPageService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  constructor() {
    super();
  }

  async create(createLandingPageDto: CreateLandingPageDto) {
    try {
      // Crear una nueva Landing Page
      const landingPage = await this.landingPage.create({
        data: {
          ...createLandingPageDto,
          planetaId: createLandingPageDto.planetaId, // Guardar directamente
        },
      });
      return new GenericSingle(landingPage, HttpStatus.CREATED, 'Landing Page creada exitosamente');

    } catch (error) {
      throw new CustomError(
        'Error al crear la Landing Page',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  async findAll() {
    try {
      const landingPages = await this.landingPage.findMany({
        where: { estado: 'ACTIVO' }
      });

      if (!landingPages) {
        throw new CustomError(
          'No se encontraron Landing Pages',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }
      return new GenericArray(landingPages, HttpStatus.OK, 'Landing Pages encontradas')

    } catch (error) {
      throw new CustomError(
        'Error al obtener las Landing Pages',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const landingPage = await this.landingPage.findUnique({
        where: {
          id: id,
          estado: 'ACTIVO',
        },
      });

      return new GenericSingle(landingPage, HttpStatus.OK, 'Landing Page encontrada')

    } catch (error) {
      throw new CustomError(
        'Error al obtener la Landing Page',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateLandingPageDto: UpdateLandingPageDto) {
    try {

      const landingPage = await this.landingPage.update({
        where: { id: id },
        data: updateLandingPageDto,
      });
      return new GenericSingle(landingPage, HttpStatus.OK, 'Landing page actualizada');

    } catch (error) {
      throw new CustomError(
        'Error al actualizar la Landing Page',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    try {
      const landingPage = await this.landingPage.update({
        where: { id: id, },
        data: { estado: 'INACTIVO' },
      });
      return new GenericSingle(landingPage, HttpStatus.OK, 'Landing page eliminada');

    } catch (error) {
      throw new CustomError(
        'Error al eliminar la Landing Page',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}