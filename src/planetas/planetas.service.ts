import { Injectable } from '@nestjs/common';
import { CreatePlanetaDto } from './dto/create-planeta.dto';
import { UpdatePlanetaDto } from './dto/update-planeta.dto';

@Injectable()
export class PlanetasService {
  create(createPlanetaDto: CreatePlanetaDto) {
    return 'This action adds a new planeta';
  }

  findAll() {
    return `This action returns all planetas`;
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
