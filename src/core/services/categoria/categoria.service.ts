import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CreateCategoriaDto,
  UpdateCategoriaDto,
} from 'src/application/dto/categoria';

import { CATEGORIA_REPOSITORY } from 'src/core/constants/constants';
import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { CategoriaRepository } from 'src/core/repositories/categoria/categoria.respository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
@Injectable()
export class CategoriaService {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private repository: CategoriaRepository,
    private readonly validator: ValidatorService,
  ) {}

  async crearCategoria(dto: CreateCategoriaDto): Promise<Categoria> {
    await this.validator.validate(dto, CreateCategoriaDto);

    const existe = await this.repository.findByName(dto.nombre);
    if (existe) {
      throw new BussinesRuleException(
        'La categoría ya existe',
        HttpStatus.BAD_REQUEST,
        {
          nombre: dto.nombre,
          codigoError: 'CATEGORIA_DUPLICADA',
        },
      );
    }

    const categoria = new Categoria(
      null,
      dto.nombre,
      dto.descripcion || '',
      dto.imagenUrl || '',
      true,
      new Date(),
      new Date(),
    );

    return this.repository.save(categoria);
  }

  async listarCategorias(): Promise<Categoria[]> {
    return this.repository.findAllActive();
  }

  async obtenerUnaCategoria(id: string): Promise<Categoria> {
    const existe = await this.repository.findById(id);

    if (!existe) {
      throw new BussinesRuleException(
        'La categoría no existe',
        HttpStatus.NOT_FOUND,
        {
          id: id,
          codigoError: 'CATEGORIA_NO_ENCONTRADA',
        },
      );
    }

    return existe;
  }

  async actualizarCategoria(
    id: string,
    dto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    await this.validator.validate(dto, UpdateCategoriaDto);

    const categoria = new Categoria(
      null,
      dto.nombre,
      dto.descripcion || '',
      dto.imagenUrl || '',
      true,
      new Date(),
      new Date(),
    );

    return this.repository.update(id, categoria);
  }

  async eliminarCategoria(id: string): Promise<Categoria> {
    const categoria = await this.obtenerUnaCategoria(id);

    const estado: boolean = categoria.estado === true ? false : true; // Cambia el estado a false si ya está en false

    return this.repository.delete(id, estado);
  }
}
