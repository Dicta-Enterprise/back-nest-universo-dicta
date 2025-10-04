import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateCategoriaDto,
  UpdateCategoriaDto,
} from 'src/application/dto/categoria';

import { CATEGORIA_REPOSITORY } from 'src/core/constants/constants';
import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { CategoriaRepository } from 'src/core/repositories/categoria/categoria.respository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { ArchivoService, OpcionesModelos3D } from '../Archivo/archivo.service';

@Injectable()
export class CategoriaService {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private repository: CategoriaRepository,
    private readonly validator: ValidatorService,
    private  archivo:ArchivoService,
  ) {}


async crearCategoria(
  dto: CreateCategoriaDto,
  modelo: Express.Multer.File,
): Promise<Categoria> {
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

  let modeloUrl: string | null = null;
  if (modelo) {
    const resultado = await this.archivo.subirArchivo(
      modelo,
      OpcionesModelos3D,
      dto.nombre, 
    );

    modeloUrl = resultado.url; 
  }


  const categoria = new Categoria(
    null,
    dto.nombre,
    dto.descripcion || '',
    true,
    new Date(),
    new Date(),
    dto.x,
    dto.y,
    dto.z,
    dto.url,
    modeloUrl, 
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
  file?: Express.Multer.File, // el archivo GLB opcional
): Promise<Categoria> {
  await this.validator.validate(dto, UpdateCategoriaDto);

  const categoriaActual = await this.repository.findById(id);
  if (!categoriaActual) {
    throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
  }

  let urlModelo = categoriaActual.modelo;


  if (file) {
    const resultadoArchivo = await this.archivo.actualizarArchivo(
      categoriaActual.modelo, 
      file,
      OpcionesModelos3D, 
      id, 
    );

    urlModelo = resultadoArchivo.url;
  }


  const categoriaActualizada = new Categoria(
    categoriaActual.id,       
    dto.nombre || categoriaActual.nombre,
    dto.descripcion || categoriaActual.descripcion,
    dto.estado ?? categoriaActual.estado,
    categoriaActual.fechaCreacion, 
    new Date(),                    
    dto.x ?? categoriaActual.x,
    dto.y ?? categoriaActual.y,
    dto.z ?? categoriaActual.z,
    dto.url || categoriaActual.url,
    urlModelo,
  );

 
  return this.repository.update(id, categoriaActualizada);
}

  async eliminarCategoria(id: string): Promise<Categoria> {

  const categoria = await this.obtenerUnaCategoria(id);
  if (!categoria) {
    throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
  }

  
  const nuevoEstado: boolean = categoria.estado === true ? false : true;

  if (!nuevoEstado && categoria.modelo) {
    await this.archivo.eliminarArchivo(categoria.modelo);
  }

  return this.repository.delete(id, nuevoEstado);
}

}
