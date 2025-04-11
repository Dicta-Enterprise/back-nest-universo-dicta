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

  // Los servicios manejan una estructura similar (galaxias , idiomas)
  async create(createLandingPageDto: CreateLandingPageDto) {
    try {
      // Crear una nueva Landing Page en la BD
      const landingPage = await this.landingPage.create({
        data: {
          ...createLandingPageDto, // Datos del dto
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
      // Buscar todas las Landing Pages que tengan estado 'ACTIVO'
      const landingPages = await this.landingPage.findMany({
        where: { estado: 'ACTIVO' }
      });
      // si no se encontraron registros muestra el mensaje
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
      // Buscar Landing por Id y que su estado sea ACTIVO
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
      // Actualiza con los datos proporcionados
      const landingPage = await this.landingPage.update({
        where: { id: id }, // la ubica por id 
        data: updateLandingPageDto, // Aplica los cambios en el dto Update
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
      // Marca la Landing Page como INACTIVO - No la elimina fisicamente de la BD ,
      // por tema de buenas practicas es recomendable no eliminarlas.
      const landingPage = await this.landingPage.update({
        where: { id: id, },  // Busca por ID
        data: { estado: 'INACTIVO' }, // Cambia estado
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