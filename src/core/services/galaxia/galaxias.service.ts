import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { CreateGalaxiaDto } from 'src/application/dto/galaxia/create-galaxia.dto';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia/update-galaxia.dto';
import { GALAXIA_REPOSITORY } from 'src/core/constants/constants';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiaRepository } from 'src/core/repositories/galaxia/galaxia.repository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { CategoriaService } from '../categoria/categoria.service';
import { CustomError } from 'src/shared/class/Error.Class';
import { Posicion } from 'src/core/entities/galaxia/atributos/posicion/posicion.entity';
import { Color } from 'src/core/entities/galaxia/atributos/color/color.entity';
import { Atributos } from 'src/core/entities/galaxia/atributos/atributos.entity';

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

    const atributos = createGalaxiaDto.atributos?.map((attr) => new Atributos(
  '', // id temporal
  '', // galaxiaId aún no existe
  attr.posicion
    ? new Posicion('', attr.posicion.x, attr.posicion.y)
    : null,
  attr.colores?.map(c => new Color('', c.type, c.value)) ?? []
)) ?? [];

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
  atributos, // ✅ ahora pasas los atributos correctamente
);

    return this.repository.save(galaxia);
  }

  async ListarGalaxia() {
    return this.repository.findAllActive();
  }

  async ObtenerGalaxia(id: string): Promise<Galaxia> {
    const existe = await this.repository.findById(id);

    if (!existe) {
      throw new BussinesRuleException(
        'No se encontró la galaxia',
        HttpStatus.NOT_FOUND,
        {
          id: id,
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
      galaxiaExistente.categoriaId,
      galaxiaExistente.atributos,
    );

    return this.repository.update(id, galaxiaActualizada);
  }
  async eliminarGalaxia(id: string): Promise<Galaxia> {
    // Verifica que la galaxia exista
    await this.ObtenerGalaxia(id); // lanza excepción si no existe

    try {
      const galaxia = await this.repository.delete(id, false);
      return galaxia;
    } catch (error) {
      throw new CustomError(
        'Error al eliminar la galaxia',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
