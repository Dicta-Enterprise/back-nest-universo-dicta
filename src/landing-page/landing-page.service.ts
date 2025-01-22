import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateLandingPageDto } from './dto/create-landing-page.dto';
import { CustomError } from 'src/shared/class/Error.Class';
import { GenericSingle } from 'src/shared/class/Generic.Class';
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
      return new GenericSingle(landingPage, HttpStatus.CREATED, 'Página creada exitosamente');
    } catch (error) {
      // Manejo de errores genéricos
      throw new CustomError(
        'Error al crear la página de aterrizaje',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  findAll() {
    return this.landingPage;
  }
}
