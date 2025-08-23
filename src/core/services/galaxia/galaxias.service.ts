import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { CreateGalaxiaDto } from 'src/application/dto/galaxia/create-galaxia.dto';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia/update-galaxia.dto';
import { GALAXIA_REPOSITORY } from 'src/core/constants/constants';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiaRepository } from 'src/core/repositories/galaxia/galaxia.repository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { CustomError } from 'src/shared/class/Error.Class';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { CategoriaService } from '../categoria/categoria.service';
import { CreateMultipleGalaxiasDto } from 'src/application/dto/galaxia/create-multiple-galaxias.dto';

@Injectable()
export class GalaxiasService {
  constructor(
    @Inject(GALAXIA_REPOSITORY)
    private repository: GalaxiaRepository,
    private categoriaService: CategoriaService,
    private readonly validator: ValidatorService,
  ) {}

  async crearGalaxia(createGalaxiaDto: CreateGalaxiaDto) {
    await this.validator.validate(createGalaxiaDto, CreateGalaxiaDto);

    const existe = await this.repository.findByNombreYCategoria(
      createGalaxiaDto.nombre,
      createGalaxiaDto.categoriaId,
    );

    if (existe) {
      throw new BussinesRuleException(
        'Ya existe una galaxia con ese nombre en la misma categoría',
        HttpStatus.BAD_REQUEST,
        {
          nombre: createGalaxiaDto.nombre,
          categoriaId: createGalaxiaDto.categoriaId,
          codigoError: 'GALAXIA_DUPLICADA_EN_CATEGORIA',
        },
      );
    }

    const categoria = await this.categoriaService.obtenerUnaCategoria(
      createGalaxiaDto.categoriaId,
    );
    if (!categoria) {
      throw new BussinesRuleException(
        'La categoría seleccionada no existe',
        HttpStatus.BAD_REQUEST,
        {
          codigoError: 'CATEGORIA_NO_ENCONTRADA',
        },
      );
    }

    const galaxia = new Galaxia(
      null,
      createGalaxiaDto.nombre,
      createGalaxiaDto.descripcion,
      createGalaxiaDto.imagen ?? null,
      createGalaxiaDto.url ?? null,
      createGalaxiaDto.textura ?? null,
      createGalaxiaDto.estado ?? true,
      createGalaxiaDto.fechaCreacion ?? new Date(),
      createGalaxiaDto.fechaActualizacion ?? new Date(),
      null,
      createGalaxiaDto.categoriaId,
      createGalaxiaDto.color ?? null,
      createGalaxiaDto.posicion ?? null,
      createGalaxiaDto.rotacion ?? null,
    );

    return this.repository.save(galaxia);
  }

  async ListarGalaxia() {
    return this.repository.findAllActive();
  }

  async crearMultiplesGalaxias(dto: CreateMultipleGalaxiasDto): Promise<Galaxia[]> {
  await this.validator.validate(dto, CreateMultipleGalaxiasDto);

  const { nombre, descripcion, galaxias: galaxiasData } = dto;
  
  // Validar que todas las categorías existan
  const categoriasIds = [...new Set(galaxiasData.map(g => g.categoriaId))];
  
  for (const categoriaId of categoriasIds) {
    const categoria = await this.categoriaService.obtenerUnaCategoria(categoriaId);
    if (!categoria) {
      throw new BussinesRuleException(
        `La categoría con ID ${categoriaId} no existe`,
        HttpStatus.BAD_REQUEST,
        {
          categoriaId,
          codigoError: 'CATEGORIA_NO_ENCONTRADA',
        },
      );
    }
  }

  // Verificar duplicados por nombre y categoría
  for (const galaxiaData of galaxiasData) {
    const existe = await this.repository.findByNombreYCategoria(
      nombre,
      galaxiaData.categoriaId,
    );

    if (existe) {
      throw new BussinesRuleException(
        `Ya existe una galaxia con el mismo nombre ${nombre} en la categoría ${galaxiaData.categoriaId}`,
        HttpStatus.BAD_REQUEST,
        {
          nombre,
          categoriaId: galaxiaData.categoriaId,
          codigoError: 'GALAXIA_DUPLICADA_EN_CATEGORIA',
        },
      );
    }
  }

  // Crear objetos Galaxia
  const galaxias: Galaxia[] = galaxiasData.map(galaxiaData => 
    new Galaxia(
      null,
      nombre,
      descripcion,
      galaxiaData.imagen ?? null,
      galaxiaData.url,
      galaxiaData.textura,
      true, // estado
      new Date(), // fechaCreacion
      new Date(), // fechaActualizacion
      null, // categoria (se llenará al guardar)
      galaxiaData.categoriaId,
      galaxiaData.color,
      galaxiaData.posicion,
      galaxiaData.rotacion,
    )
  );

  return this.repository.saveMultiple(galaxias);
}

  async ObtenerGalaxia(id: string): Promise<Galaxia> {
    const existe = await this.repository.findById(id);

    if (!existe) {
      throw new BussinesRuleException(
        'No se encontró la galaxia',
        HttpStatus.NOT_FOUND,
        {
          id,
          codigoError: 'GALAXIA_NO_ENCONTRADA',
        },
      );
    }
    return existe;
  }

  async ActualizarGalaxia(id: string, dto: UpdateGalaxiaDto): Promise<Galaxia> {
    await this.validator.validate(dto, UpdateGalaxiaDto);

    const galaxiaExistente = await this.repository.findById(id);

    if (!galaxiaExistente) {
      throw new BussinesRuleException(
        'No se encontró la galaxia',
        HttpStatus.NOT_FOUND,
        {
          id,
          codigoError: 'GALAXIA_NO_ENCONTRADA',
        },
      );
    }

    const galaxiaActualizada = new Galaxia(
      id,
      dto.nombre ?? galaxiaExistente.nombre,
      dto.descripcion ?? galaxiaExistente.descripcion,
      dto.imagen ?? galaxiaExistente.imagen,
      dto.url ?? galaxiaExistente.url,
      dto.textura ?? galaxiaExistente.textura,
      dto.estado ?? galaxiaExistente.estado,
      galaxiaExistente.fechaCreacion,
      new Date(),
      galaxiaExistente.categoria,
      dto.categoriaId ?? galaxiaExistente.categoriaId,
      dto.color ?? galaxiaExistente.color,
      dto.posicion ?? galaxiaExistente.posicion,
      dto.rotacion ?? galaxiaExistente.rotacion,
    );

    return this.repository.update(id, galaxiaActualizada);
  }

  async eliminarGalaxia(id: string): Promise<Galaxia> {
    await this.ObtenerGalaxia(id); // lanza excepción si no existe

    try {
      return await this.repository.delete(id, false);
    } catch (error) {
      throw new CustomError(
        'Error al eliminar la galaxia',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
