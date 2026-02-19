import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateGalaxiaDto } from '../../../application/dto/galaxia/create-galaxia.dto';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia/update-galaxia.dto';
import { GALAXIA_REPOSITORY } from 'src/core/constants/constants';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiaRepository } from 'src/core/repositories/galaxia/galaxia.repository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { CustomError } from 'src/shared/class/Error.Class';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { CategoriaService } from '../categoria/categoria.service';
import { CreateMultipleGalaxiasDto } from 'src/application/dto/galaxia/create-multiple-galaxia.dto';
import { GalaxiaPaginationDto } from 'src/application/dto/galaxia';
import { Galaxia3DResponseDto } from 'src/application/dto/galaxia/response-galaxia.dto';
import { GalaxiasPorCategoriaResponseDto } from 'src/application/dto/galaxia/galaxia-por-categoria-response.dto';
import { plainToInstance } from 'class-transformer';
import { generarTemaDesdeNombre } from 'src/shared/helper/galaxias.helper';

@Injectable()
export class GalaxiasService {
  constructor(
    @Inject(GALAXIA_REPOSITORY)
    private repository: GalaxiaRepository,
    private categoriaService: CategoriaService,
    private readonly validator: ValidatorService,
  ) {}

  async crearGalaxia(createGalaxiaDto: CreateGalaxiaDto): Promise<Galaxia> {
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

    const temaGalaxia = createGalaxiaDto.tema || generarTemaDesdeNombre(createGalaxiaDto.nombre);

    const galaxia = new Galaxia(
      null,
      createGalaxiaDto.nombre,
      temaGalaxia,
      createGalaxiaDto.descripcion,
      createGalaxiaDto.imagen ?? null,
      createGalaxiaDto.url ?? null,
      createGalaxiaDto.textura ?? null,
      createGalaxiaDto.estado ?? true,
      createGalaxiaDto.fechaCreacion ?? new Date(),
      createGalaxiaDto.fechaActualizacion ?? new Date(),
      createGalaxiaDto.categoria,
      createGalaxiaDto.categoriaId,
      createGalaxiaDto.color,
      createGalaxiaDto.posicion,
      createGalaxiaDto.rotacion, 
    );

    return this.repository.save(galaxia);
  }

  async listarGalaxia(galaxiaPaginationDto: GalaxiaPaginationDto): Promise<Galaxia[]> {
    return this.repository.findAllActive(galaxiaPaginationDto);
  }

  async crearMultiplesGalaxias(dto: CreateMultipleGalaxiasDto): Promise<Galaxia[]> {
    await this.validator.validate(dto, CreateMultipleGalaxiasDto);

    const { nombre: nombreGrupo, descripcion: descripcionGrupo, galaxias: galaxiasData } = dto;
    
    const categoriasIds = [...new Set(galaxiasData.map(g => g.categoriaId))];
    
    for (const categoriaId of categoriasIds) {
      const categoria = await this.categoriaService.obtenerUnaCategoria(categoriaId);
      if (!categoria) {
        throw new BussinesRuleException(
          `La categoría con ID ${categoriaId} no existe`,
          HttpStatus.BAD_REQUEST,
          { categoriaId, codigoError: 'CATEGORIA_NO_ENCONTRADA' },
        );
      }
    }

    for (const galaxiaData of galaxiasData) {
      const nombreGalaxia = galaxiaData.nombre || nombreGrupo;
      const existe = await this.repository.findByNombreYCategoria(
        nombreGalaxia,
        galaxiaData.categoriaId,
      );

      if (existe) {
        throw new BussinesRuleException(
          `Ya existe una galaxia con el mismo nombre ${nombreGalaxia} en la categoría ${galaxiaData.categoriaId}`,
          HttpStatus.BAD_REQUEST,
          {
            nombre: nombreGalaxia,
            categoriaId: galaxiaData.categoriaId,
            codigoError: 'GALAXIA_DUPLICADA_EN_CATEGORIA',
          },
        );
      }
    }

    const galaxias: Galaxia[] = galaxiasData.map(galaxiaData => {
      const nombreGalaxia = galaxiaData.nombre || nombreGrupo;
      const temaGalaxia = galaxiaData.tema || generarTemaDesdeNombre(nombreGalaxia);

      return new Galaxia(
        null,
        nombreGalaxia,
        temaGalaxia,
        galaxiaData.descripcion || descripcionGrupo,
        galaxiaData.imagen ?? null,
        galaxiaData.url,
        galaxiaData.textura,
        galaxiaData.estado ?? true,
        new Date(),
        new Date(),
        galaxiaData.categoria,
        galaxiaData.categoriaId,
        galaxiaData.color,
        galaxiaData.posicion,
        galaxiaData.rotacion,
      );
    });

    return this.repository.saveMultiple(galaxias);
  }

  async obtenerGalaxia(id: string): Promise<Galaxia> {
    const existe = await this.repository.findById(id);

    if (!existe) {
      throw new BussinesRuleException(
        'Error',
        HttpStatus.NOT_FOUND,
      );
    }
    return existe;
  }

  async obtenerGalaxiaPara3D(id: string): Promise<Galaxia3DResponseDto> {
    const galaxia = await this.obtenerGalaxia(id);
    
    return plainToInstance(Galaxia3DResponseDto, {
      ...galaxia,
      id: galaxia.id,
      tema: galaxia.tema || generarTemaDesdeNombre(galaxia.nombre),
      active: galaxia.estado,
      
    }, {
      excludeExtraneousValues: true,
    });
  }

  async obtenerGalaxiasPorCategoriaPara3D(categoriaId: string): Promise<GalaxiasPorCategoriaResponseDto> {
    const categoria = await this.categoriaService.obtenerUnaCategoria(categoriaId);
    if (!categoria) {
      throw new BussinesRuleException(
        `Categoría con ID ${categoriaId} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    const galaxias = await this.repository.findByCategoriaId(categoriaId);
    const galaxiasActivas = galaxias.filter(g => g.estado !== false);

    const galaxiasFormateadas = galaxiasActivas.map(galaxia => 
      plainToInstance(Galaxia3DResponseDto, {
        ...galaxia,
        id: galaxia.id,
        tema: galaxia.tema || generarTemaDesdeNombre(galaxia.nombre),
        active: galaxia.estado,
      }, {
        excludeExtraneousValues: true,
      })
    );

    return {
      categoria: categoria.nombre?.toLowerCase() || 'general',
      galaxias: galaxiasFormateadas,
      total: galaxiasFormateadas.length,
    };
  }

  async actualizarGalaxia(id: string, dto: UpdateGalaxiaDto): Promise<Galaxia> {
    await this.validator.validate(dto, UpdateGalaxiaDto);

    const galaxiaExistente = await this.repository.findById(id);

    if (!galaxiaExistente) {
      throw new BussinesRuleException(
        'Error',
        HttpStatus.NOT_FOUND,
      );
    }

    const temaGalaxia = dto.tema || galaxiaExistente.tema || generarTemaDesdeNombre(dto.nombre || galaxiaExistente.nombre);

    const galaxiaActualizada = new Galaxia(
      id,
      dto.nombre ?? galaxiaExistente.nombre,
      temaGalaxia,
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
    await this.obtenerGalaxia(id);

    try {
      return await this.repository.delete(id, false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new CustomError(
        'Error',
        message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}