import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePlanetaDto } from './dto/create-planeta.dto';
import { UpdatePlanetaDto } from './dto/update-planeta.dto';
import { PrismaClient } from '@prisma/client';
import { CustomError } from 'src/shared/class/Error.Class';
import { GenericArray, GenericSingle } from '../shared/class/Generic.Class';





@Injectable()
export class PlanetasService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
      await this.$connect();
  }
  constructor(){
    super();
  }
  private async veirificarExistenciaGalaxia(galaxiaId: string):Promise<void>{
    const galaxia = await this.galaxia.findUnique({where:{id:galaxiaId}});
    if(!galaxia){
      throw new CustomError(
        'La id de galaxia que esta colocando no existe',
        'Conflict',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  private async verificarGalaxiaSinAsignar(galaxiaId: string, excludeplanetaId?: string): Promise<void>{
    const existingPlaneta = await this.planeta.findFirst({
      where :{
        galaxiaId,
        id: excludeplanetaId ? { not: excludeplanetaId } : undefined
      },
    });
    if(existingPlaneta){
      throw new CustomError(
        `El planeta con ID ${galaxiaId} ya esta asignado a otra landing page`,
        'Conflict',
        HttpStatus.CONFLICT
      )
    }
  }
  private async verificarNombreUnico(nombre: string): Promise<void> {
    const existingPlaneta = await this.planeta.findUnique({ where: { nombre } });

    if (existingPlaneta) {
      throw new CustomError(
        'Ya existe un planeta con ese nombre',
        'Conflict',
        HttpStatus.CONFLICT
      );
    }
  }
  async create(CreatePlanetaDto: CreatePlanetaDto) {
    try {
      const { galaxiaId, nombre } = CreatePlanetaDto;

      await this.veirificarExistenciaGalaxia(galaxiaId);
      await this.verificarGalaxiaSinAsignar(galaxiaId);
      await this.verificarNombreUnico(nombre);

      // Crear una nueva Landing Page
      const planeta = await this.planeta.create({
        data: {
          ...CreatePlanetaDto,
          galaxiaId: CreatePlanetaDto.galaxiaId, // Guardar directamente
        },
      });
      return new GenericSingle(planeta, HttpStatus.CREATED, 'planeta creado de forma exitosa');

    } catch (error) {
      if (error instanceof CustomError) {
        return error;
      }
      throw new CustomError(
        'Error al crear el planeta',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      const planeta = await this.planeta.findMany({
        where: { estado: 'ACTIVO' }
      });

      if (!planeta) {
        throw new CustomError(
          'No se encontraron Landing Pages',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }
      return new GenericArray(planeta, HttpStatus.OK, 'planetas no encontrados')

    } catch (error) {
      throw new CustomError(
        'Error al obtener planetas',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const planeta = await this.planeta.findUnique({
        where: {
          id: id,
          estado: 'ACTIVO',
        },
      });

      if (!planeta) {
        return new CustomError(
          `No se encontro el planeta selccionado".`,
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }
      return new GenericSingle(planeta, HttpStatus.OK, 'Planeta encontrado')

    } catch (error) {
      throw new CustomError(
        'Error al obtener el planeta',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, UpdatePlanetaDto: UpdatePlanetaDto) {
    try {
      const { galaxiaId, nombre } = UpdatePlanetaDto;
      const existingPlaneta = await this.planeta.findUnique({ where: { id }, });

      if (!existingPlaneta) {
        return new CustomError(
          `No se encontró el planeta seleccionado`,
          'Not Found',
          HttpStatus.NOT_FOUND
        );
      }

      if (galaxiaId && galaxiaId !== existingPlaneta.galaxiaId) {
        await this.veirificarExistenciaGalaxia(galaxiaId);
        await this.verificarGalaxiaSinAsignar(galaxiaId, id);
      }
      if (nombre && nombre !== existingPlaneta.nombre) {
        await this.verificarNombreUnico(nombre);
      }

      // Actualizar
      const planeta = await this.planeta.update({
        where: { id: id },
        data: UpdatePlanetaDto,
      });
      return new GenericSingle(planeta, HttpStatus.OK, 'Planeta Actualizado');

    } catch (error) {
      if (error instanceof CustomError) {
        return error;
      }
      throw new CustomError(
        'Error al actualizar el planeta',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  async remove(id: string) {
    try {
      const existingPlaneta = await this.planeta.findUnique({ where: { id }, });

      if (!existingPlaneta) {
        return new CustomError(
          `No se encontró el planeta seleccionado".`,
          'Not Found',
          HttpStatus.NOT_FOUND
        );
      }
      const planeta = await this.planeta.update({
        where: { id: id, },
        data: { estado: 'INACTIVO' },
      });
      return new GenericSingle(planeta, HttpStatus.OK, 'planeta eliminado');

    } catch (error) {
      throw new CustomError(
        'Error al eliminar planeta',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
