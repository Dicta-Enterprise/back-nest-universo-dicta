import { Injectable } from '@nestjs/common';
import { Parameters } from '../../../core/entities/parameters/parameters.entity';
import { Paginacion } from '../../../core/entities/paginacion/paginacion.entity';
import { BussinesRuleException } from '../../../shared/domain/exceptions/business-rule.exception';
import { GetParametersPaginationDto } from 'src/application/dto/parameters/parameters.dto';
import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { Idioma } from 'src/core/entities/idioma/idioma.entity';
import { Profesor } from 'src/core/entities/profesor/profesor.entity';

import { CategoriaService } from '../categoria/categoria.service';
import { GalaxiasService } from '../galaxia/galaxias.service';
import { PlanetasService } from '../planeta/planetas.service';
import { IdiomaService } from '../idioma/idioma.service';
import { ProfesorService } from '../profesor/profesor.service';

@Injectable()
export class ParametersService {
  private readonly defaultPagination = { page: 1, limit: 1000 };

  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly galaxiasService: GalaxiasService,
    private readonly planetaService: PlanetasService,
    private readonly idiomaService: IdiomaService,
    private readonly profesorService: ProfesorService,
  ) {}

  async getParameters(type?: string): Promise<Parameters[] | Record<string, Parameters[]>> {
    try {
      if (!type) {
        return this.getAll();
      }

      const handler = this.handlers[type.toUpperCase()];

      if (!handler) {
        throw new BussinesRuleException(
          `Tipo de parámetro '${type}' no válido. Tipos válidos: ${Object.keys(this.handlers).join(', ')}`,
          4001,
        );
      }

      return await handler();
    } catch (error) {
      if (error instanceof BussinesRuleException) {
        throw error;
      }

      throw new BussinesRuleException(
        'Error al obtener los parámetros del sistema',
        5001,
        error,
      );
    }
  }

  async getParametersWithPagination(query: GetParametersPaginationDto): Promise<Record<string, Paginacion<Parameters>>> {
    try {
      const { type, page = 1, limit = 10 } = query;

      if (!type) {
        return await this.getAllWithPagination(page, limit);
      }

      const handler = this.paginationHandlers[type.toUpperCase()];

      if (!handler) {
        throw new BussinesRuleException(
          `Tipo de parámetro '${type}' no válido. Tipos válidos: ${Object.keys(this.paginationHandlers).join(', ')}`,
          4001,
        );
      }

      const result = await handler(page, limit);
      return { [type.toUpperCase()]: result };
    } catch (error) {
      if (error instanceof BussinesRuleException) {
        throw error;
      }

      throw new BussinesRuleException(
        'Error al obtener los parámetros del sistema',
        5001,
        error,
      );
    }
  }

  // Métodos específicos manteniendo la lógica original
  private async getCategorias(): Promise<Parameters[]> {
    const categorias: Categoria[] = await this.categoriaService.listarCategorias();
    return this.transformToParameter(categorias, 'nombre', 'CATE');
  }

  private async getGalaxias(): Promise<Parameters[]> {
    const resultado = await this.galaxiasService.listarGalaxia(this.defaultPagination);
    const galaxias: Galaxia[] = this.extraerDatosDeResultado<Galaxia>(resultado);
    return this.transformToParameter(galaxias, 'nombre', 'GALA');
  }

  private async getPlanetas(): Promise<Parameters[]> {
    const resultado = await this.planetaService.listarPlanetas(this.defaultPagination);
    const planetas: Planeta[] = this.extraerDatosDeResultado<Planeta>(resultado);
    return this.transformToParameter(planetas, 'nombre', 'PLAN');
  }

  private async getIdiomas(): Promise<Parameters[]> {
    const idiomas: Idioma[] = await this.idiomaService.listarIdiomas();
    return this.transformToParameter(idiomas, 'nombre', 'IDIO');
  }

  // Métodos de paginación específicos
  private async getCategoriasPagination(page: number, limit: number): Promise<Paginacion<Parameters>> {
    const allCategorias: Categoria[] = await this.categoriaService.listarCategorias();
    const transformedItems = this.transformToParameter(allCategorias, 'nombre', 'CATE');
    return this.createPagination(transformedItems, page, limit);
  }

  private async getGalaxiasPagination(page: number, limit: number): Promise<Paginacion<Parameters>> {
    const resultado = await this.galaxiasService.listarGalaxia({ page, limit });
    const galaxias: Galaxia[] = this.extraerDatosDeResultado<Galaxia>(resultado);
    const transformedItems = this.transformToParameter(galaxias, 'nombre', 'GALA');
    return this.createPagination(transformedItems, page, limit);
  }

  private async getPlanetasPagination(page: number, limit: number): Promise<Paginacion<Parameters>> {
    const resultado = await this.planetaService.listarPlanetas({ page, limit });
    const planetas: Planeta[] = this.extraerDatosDeResultado<Planeta>(resultado);
    const transformedItems = this.transformToParameter(planetas, 'nombre', 'PLAN');
    return this.createPagination(transformedItems, page, limit);
  }

  private async getIdiomasPagination(page: number, limit: number): Promise<Paginacion<Parameters>> {
    const allIdiomas: Idioma[] = await this.idiomaService.listarIdiomas();
    const transformedItems = this.transformToParameter(allIdiomas, 'nombre', 'IDIO');
    return this.createPagination(transformedItems, page, limit);
  }

  private readonly handlers: Record<string, () => Promise<Parameters[]>> = {
    DP_CATEGORIAS: () => this.getCategorias(),
    DP_GALAXIAS: () => this.getGalaxias(),
    DP_PLANETAS: () => this.getPlanetas(),
    DP_IDIOMAS: () => this.getIdiomas(),
    DP_PROFESORES: () => this.transformProfesores(),
  };

  private readonly paginationHandlers: Record<string, (page: number, limit: number) => Promise<Paginacion<Parameters>>> = {
    DP_CATEGORIAS: (page, limit) => this.getCategoriasPagination(page, limit),
    DP_GALAXIAS: (page, limit) => this.getGalaxiasPagination(page, limit),
    DP_PLANETAS: (page, limit) => this.getPlanetasPagination(page, limit),
    DP_IDIOMAS: (page, limit) => this.getIdiomasPagination(page, limit),
    DP_PROFESORES: (page, limit) => this.getProfesoresPagination(page, limit),
  };

  private async getAllWithPagination(page: number, limit: number): Promise<Record<string, Paginacion<Parameters>>> {
    const results = await Promise.all([
      this.getCategoriasPagination(page, limit),
      this.getGalaxiasPagination(page, limit),
      this.getPlanetasPagination(page, limit),
      this.getIdiomasPagination(page, limit),
      this.getProfesoresPagination(page, limit),
    ]);

    return {
      DP_CATEGORIAS: results[0],
      DP_GALAXIAS: results[1],
      DP_PLANETAS: results[2],
      DP_IDIOMAS: results[3],
      DP_PROFESORES: results[4],
    };
  }

  private async getAll(): Promise<Record<string, Parameters[]>> {
    const results = await Promise.all([
      this.getCategorias(),
      this.getGalaxias(),
      this.getPlanetas(),
      this.getIdiomas(),
      this.transformProfesores(),
    ]);

    return {
      DP_CATEGORIAS: results[0],
      DP_GALAXIAS: results[1],
      DP_PLANETAS: results[2],
      DP_IDIOMAS: results[3],
      DP_PROFESORES: results[4],
    };
  }

  private async transformProfesores(): Promise<Parameters[]> {
    const rawData = await this.profesorService.listarProfesores();
    const profesores: Profesor[] = this.extraerDatosDeResultado<Profesor>(rawData);
    
    return profesores
      .filter(p => p?.id)
      .map(p => {
        const nombreCompleto = [
          p.nombre,
          p.apellido_paterno,
          p.apellido_materno,
        ]
          .filter(Boolean)
          .join(' ');

        return new Parameters(
          p.id,
          nombreCompleto,
          this.generarCodigo('PROF', nombreCompleto),
        );
      });
  }

  private async getProfesoresPagination(page: number, limit: number): Promise<Paginacion<Parameters>> {
    const items = await this.transformProfesores();
    return this.createPagination(items, page, limit);
  }

  private createPagination<T>(items: T[], page: number, limit: number): Paginacion<T> {
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedItems = items.slice(startIndex, endIndex);
    
    return new Paginacion<T>(
      paginatedItems,
      page,
      limit,
      total,
      totalPages,
      page < totalPages,
      page > 1
    );
  }

  private extraerDatosDeResultado<T>(resultado: T[] | { data?: T[]; items?: T[]; results?: T[] }): T[] {
    if (Array.isArray(resultado)) {
      return resultado;
    } else if (resultado && typeof resultado === 'object') {
      if ('data' in resultado && Array.isArray(resultado.data)) {
        return resultado.data;
      } else if ('items' in resultado && Array.isArray(resultado.items)) {
        return resultado.items;
      } else if ('results' in resultado && Array.isArray(resultado.results)) {
        return resultado.results;
      }
      return [];
    }
    return [];
  }

  private transformToParameter<T extends { id: string }>(
    items: T[],
    nameField: keyof T,
    tipo: string,
  ): Parameters[] {
    if (!Array.isArray(items)) {
      throw new BussinesRuleException(
        'Formato inválido de datos de parámetros',
        5002,
      );
    }

    return items
      .filter(item => item?.id && item[nameField])
      .map(item => new Parameters(
        item.id,
        String(item[nameField]),
        this.generarCodigo(tipo, String(item[nameField])),
      ));
  }

  private generarCodigo(tipo: string, nombre: string): string {
    const tipoCodigo = tipo.toUpperCase();

    const nombreCodigo = nombre
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z\s-]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')
      .replace(/_+/g, '_');

    return `P_${tipoCodigo}_${nombreCodigo}`;
  }
}