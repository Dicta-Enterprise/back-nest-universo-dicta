import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePlanetaDto } from './dto/create-planeta.dto';
import { UpdatePlanetaDto } from './dto/update-planeta.dto';
import { PrismaClient } from '@prisma/client';
import { CustomError } from 'src/shared/class/Error.Class';
import { GenericSingle } from '../shared/class/Generic.Class';
import { Galaxia } from 'src/galaxias/entities/galaxia.entity';


@Injectable()
export class PlanetasService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
      await this.$connect();
  }
  constructor(){
    super();
  }
  
  async create(CreatePlanetaDto: CreatePlanetaDto){
    try{
      const onePlaneta = await this.planeta.findUnique({
        where:{
          nombre: CreatePlanetaDto.nombre,
        },
      });
      if(onePlaneta){
        return new CustomError(
          'Ya existe un planeta con ese nombre',
          'Conflict',
          HttpStatus.BAD_REQUEST,
        );
      }
      const planeta = await this.planeta.create({
        data: CreatePlanetaDto,
      });
      return new GenericSingle (planeta, HttpStatus.CREATED, 'Planeta creado con exito');
    } catch (error){
      throw new CustomError(
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  

  findOne(id: number) {
    return `This action returns a #${id} planeta`;
  }

  update(id: number, updatePlanetaDto: UpdatePlanetaDto) {
    return `This action updates a #${id} planeta`;
  }

  remove(id: number) {
    return `This action removes a #${id} planeta`;
  }
}
