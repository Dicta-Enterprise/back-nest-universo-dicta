import { HttpStatus, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
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
      // Verificar que el planeta exista
      const planeta = await this.planeta.findUnique({
        where: { id: createLandingPageDto.planetaId },
      });
  
      if (!planeta) {
        return new CustomError(
          `El planeta con ID ${createLandingPageDto.planetaId} no existe`,
          'Conflict',
          HttpStatus.BAD_REQUEST,
        );
      }
  
      // Verificar si el planeta ya está asignado a un landing page
      const existingLandingForPlaneta = await this.landingPage.findFirst({
        where: {
          planetaId: createLandingPageDto.planetaId,
        },
      });
  
      if (existingLandingForPlaneta) {
        return new CustomError(
          `El planeta con ID ${createLandingPageDto.planetaId} ya está asignado a otra landing page`,
          'Conflict',
          HttpStatus.CONFLICT, // Código HTTP 409 para conflictos
        );
      }
  
      // Verificar si ya existe una Landing Page con el mismo título
      const existingLandingPage = await this.landingPage.findUnique({
        where: {
          titulo: createLandingPageDto.titulo,
        },
      });
  
      if (existingLandingPage) {
        return new CustomError(
          'Ya existe una página de aterrizaje con ese título',
          'Conflict',
          HttpStatus.CONFLICT, 
        );
      }
  
      // Crear una nueva Landing asociada al planeta
      const { titulo, descripcion, contenido, estado } = createLandingPageDto;
      const landingPage = await this.landingPage.create({
        data: {
          titulo,
          descripcion,
          contenido,
          estado: estado || 'ACTIVO',
          planeta: {
            connect: { id: createLandingPageDto.planetaId },
          },
        },
      });
  
      return new GenericSingle(
        landingPage,
        HttpStatus.CREATED,
        'Página creada exitosamente',
      );
    } catch (error) {
      if (error instanceof CustomError || error instanceof NotFoundException) {
        throw error;
      }

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

  async update(id: string, updateLandingPageDto: UpdateLandingPageDto) {
    try {
      const landingPage = await this.landingPage.update({
        where: {
          id: id,
        },
        data: updateLandingPageDto,
      });

      if (!landingPage) {
        throw new CustomError(
          'No se encontró la landing page',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      return new GenericSingle(landingPage, HttpStatus.OK, 'Landing page actualizada');
    } catch (error) {
      throw new CustomError(
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async remove(id: string) {
    try {
      const landingPage = await this.landingPage.update({
        where: {
          id: id,
        },
        data: {
          estado: 'INACTIVO',
        },
      });

      if (!landingPage) {
        throw new CustomError(
          'No se encontró la landing page',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      return new GenericSingle(landingPage, HttpStatus.OK, 'Landing page eliminada');
    } catch (error) {
      throw new CustomError(
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
