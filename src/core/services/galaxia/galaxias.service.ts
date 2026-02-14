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
import { Galaxia3DResponseDto  } from 'src/application/dto/galaxia/response-galaxia.dto';
import { GalaxiasPorCategoriaResponseDto } from 'src/application/dto/galaxia/galaxia-por-categoria-response.dto';
import { plainToInstance } from 'class-transformer';

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

    const posicionFormateada = this.ensureObjectFormat(createGalaxiaDto.posicion);
    const rotacionFormateada = this.ensureObjectFormat(createGalaxiaDto.rotacion);
    const temaGalaxia = createGalaxiaDto.tema || this.generarTemaDesdeNombre(createGalaxiaDto.nombre);

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
      posicionFormateada,
      rotacionFormateada,
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
          {
            categoriaId,
            codigoError: 'CATEGORIA_NO_ENCONTRADA',
          },
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
      const posicionFormateada = this.ensureObjectFormat(galaxiaData.posicion);
      const rotacionFormateada = this.ensureObjectFormat(galaxiaData.rotacion);
      const nombreGalaxia = galaxiaData.nombre || nombreGrupo;
      const temaGalaxia = galaxiaData.tema || this.generarTemaDesdeNombre(nombreGalaxia);

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
        posicionFormateada,
        rotacionFormateada,
      );
    });

    return this.repository.saveMultiple(galaxias);
  }

  async obtenerGalaxia(id: string): Promise<Galaxia> {
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

  async obtenerGalaxiaPara3D(id: string): Promise<Galaxia3DResponseDto> {
    const galaxia = await this.obtenerGalaxia(id);
    
    return plainToInstance(Galaxia3DResponseDto, {
      id: galaxia.id,
      tema: galaxia.tema || this.generarTemaDesdeNombre(galaxia.nombre),
      color: galaxia.color,
      posicion: this.formatPositionFor3D(galaxia.posicion),
      rotacion: this.formatRotationFor3D(galaxia.rotacion),
      active: galaxia.estado,
      categoriaId: galaxia.categoriaId,
      nombre: galaxia.nombre,
      descripcion: galaxia.descripcion,
      imagen: galaxia.imagen,
      textura: galaxia.textura,
      url: galaxia.url,
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
        {
          categoriaId,
          codigoError: 'CATEGORIA_NO_ENCONTRADA',
        },
      );
    }

    const galaxias = await this.repository.findByCategoriaId(categoriaId);
    
    const galaxiasActivas = galaxias.filter(g => g.estado !== false);

    const galaxiasFormateadas = galaxiasActivas.map(galaxia => 
      plainToInstance(Galaxia3DResponseDto, {
        id: galaxia.id,
        tema: galaxia.tema || this.generarTemaDesdeNombre(galaxia.nombre),
        color: galaxia.color,
        posicion: this.formatPositionFor3D(galaxia.posicion),
        rotacion: this.formatRotationFor3D(galaxia.rotacion),
        active: galaxia.estado,
        categoriaId: galaxia.categoriaId,
        nombre: galaxia.nombre,
        descripcion: galaxia.descripcion,
        imagen: galaxia.imagen,
        textura: galaxia.textura,
        url: galaxia.url,
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
        'No se encontró la galaxia',
        HttpStatus.NOT_FOUND,
        {
          id,
          codigoError: 'GALAXIA_NO_ENCONTRADA',
        },
      );
    }

    let posicionFormateada = galaxiaExistente.posicion;
    if (dto.posicion) {
      posicionFormateada = this.ensureObjectFormat(dto.posicion);
    }

    let rotacionFormateada = galaxiaExistente.rotacion;
    if (dto.rotacion) {
      rotacionFormateada = this.ensureObjectFormat(dto.rotacion);
    }

    const temaGalaxia = dto.tema || galaxiaExistente.tema || this.generarTemaDesdeNombre(dto.nombre || galaxiaExistente.nombre);

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
      posicionFormateada,
      rotacionFormateada,
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
        'Error al eliminar la galaxia',
        message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private ensureObjectFormat(value: unknown): { x: number; y: number; z: number } {
    if (!value) {
      return { x: 0, y: 0, z: 0 };
    }
    
    if (Array.isArray(value)) {
      return {
        x: Number(value[0]) ?? 0,
        y: Number(value[1]) ?? 0,
        z: Number(value[2]) ?? 0,
      };
    }
    
    if (typeof value === 'object' && value !== null) {
      const v = value as { x?: number; y?: number; z?: number };
      return {
        x: v.x ?? 0,
        y: v.y ?? 0,
        z: v.z ?? 0,
      };
    }
    
    return { x: 0, y: 0, z: 0 };
  }

  private formatPositionFor3D(posicion: unknown): number[] {
    if (Array.isArray(posicion)) {
      return posicion as number[];
    }
    if (posicion && typeof posicion === 'object') {
      const p = posicion as { x?: number; y?: number; z?: number };
      return [
        p.x ?? 0, 
        p.y ?? 0, 
        p.z ?? 0
      ];
    }
    return [0, 0, 0];
  }

  private formatRotationFor3D(rotacion: unknown): number[] {
    if (Array.isArray(rotacion)) {
      return rotacion as number[];
    }
    if (rotacion && typeof rotacion === 'object') {
      const r = rotacion as { x?: number; y?: number; z?: number };
      return [
        r.x ?? 0, 
        r.y ?? 0, 
        r.z ?? 0
      ];
    }
    return [0, 0, 0];
  }

  private generarTemaDesdeNombre(nombre: string): string {
    if (!nombre) return 'galaxia';
    return nombre.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}