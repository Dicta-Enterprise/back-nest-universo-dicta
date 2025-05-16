import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateMenuDto } from 'src/application/dto/menu/create-menu.dto';
import { UpdateMenuDto } from 'src/application/dto/menu/update-menu.dto';

@Injectable()
export class MenuService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  constructor() {
    super();
  }

  async create(createMenuDto: CreateMenuDto) {
    return `This action removes a #${createMenuDto} menu`;

  }

  async findAll() {
    return `This action removes a  menu`;

  }

  async findOne(id: string) {
    console.log(id);
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    console.log(id);
    console.log(updateMenuDto);
  }

  remove(id: string) {
    return `This action removes a #${id} menu`;
  }
}
