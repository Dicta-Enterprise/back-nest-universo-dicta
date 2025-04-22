import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateIdiomaDto } from 'src/application/dto/idioma/create-idioma.dto';
import { CreateIdiomaUseCase } from 'src/application/uses-cases/idioma/create-idioma.use-case';

@Controller('idioma')
export class IdiomaController {
  constructor(private createIdiomaUseCase: CreateIdiomaUseCase) {}

  @Post()
  async create(@Body() createIdiomaDto: CreateIdiomaDto) {
    const result = await this.createIdiomaUseCase.execute(createIdiomaDto);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result.getValue(),
      message: 'Idioma creado',
    };
  }
}
