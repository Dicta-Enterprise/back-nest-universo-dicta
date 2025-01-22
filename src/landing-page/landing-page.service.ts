import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateLandingPageDto } from './dto/create-landing-page.dto';
import { CustomError } from 'src/shared/class/Error.Class';
import { GenericArray, GenericSingle } from 'src/shared/class/Generic.Class';
import { PrismaClient } from '@prisma/client';

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
      // Verificar si ya existe una página con el mismo título
      const existingLandingPage = await this.landingPage.findUnique({
        where: {
          titulo: createLandingPageDto.titulo,
        },
      });

      if (existingLandingPage) {
        return new CustomError(
          'Ya existe una página de aterrizaje con ese título',
          'Conflict',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validar que los campos requeridos estén completos
      const { titulo, descripcion, contenido } = createLandingPageDto;
      if (!titulo || !descripcion || !contenido) {
        return new CustomError(
          'Todos los campos (título, descripción y contenido) son obligatorios',
          'Bad Request',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Crear una nueva página de aterrizaje
      const landingPage = await this.landingPage.create({
        data: {
          titulo,
          descripcion,
          contenido,
        },
      });

      // Retornar la nueva página creada
      return new GenericSingle(landingPage, HttpStatus.CREATED, 'Landing Page creada exitosamente');
    } catch (error) {
      // Manejo de errores genéricos
      throw new CustomError(
        'Error al crear la landing Page',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const landingPages = await this.landingPage.findMany({
        where: {
          estado: 'ACTIVO',
        },
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
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async finOne(id: string) {
    try {
      const landingPage = await this.landingPage.findUnique({
        where: {
          id: id,
          estado: 'ACTIVO',
        },
      });

      if (!landingPage) {
        throw new CustomError(
          'No se encontró la landing page',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      return new GenericSingle(landingPage, HttpStatus.OK, 'Landing Page encontrada')
    } catch (error) {
      throw new CustomError(
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
