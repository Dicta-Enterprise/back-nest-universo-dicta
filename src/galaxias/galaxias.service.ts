import { Injectable } from '@nestjs/common';
import { CreateGalaxiaDto } from './dto/create-galaxia.dto';
import { UpdateGalaxiaDto } from './dto/update-galaxia.dto';

@Injectable()
export class GalaxiasService {
  create(createGalaxiaDto: CreateGalaxiaDto) {
    return 'This action adds a new galaxia';
  }

  findAll() {
    return `This action returns all galaxias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} galaxia`;
  }

  update(id: number, updateGalaxiaDto: UpdateGalaxiaDto) {
    return `This action updates a #${id} galaxia`;
  }

  remove(id: number) {
    return `This action removes a #${id} galaxia`;
  }
}
