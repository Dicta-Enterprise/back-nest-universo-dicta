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

      // Si no hay tipo, obtener todos los parámetros paginados
      if (!type) {
        return await this.getAllWithPagination(page, limit);
      }

      // Validar el tipo
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

  private readonly handlers: Record<string, () => Promise<Parameters[]>> = {
    DP_CATEGORIAS: () => this.getCategorias(),
    DP_GALAXIAS: () => this.getGalaxias(),
    DP_PLANETAS: () => this.getPlanetas(),
    DP_IDIOMAS: () => this.getIdiomas(),
    DP_PROFESORES: () => this.getProfesores(),
  };

  private readonly paginationHandlers: Record<string, (page: number, limit: number) => Promise<Paginacion<Parameters>>> = {
    DP_CATEGORIAS: (page, limit) => this.getCategoriasPagination(page, limit),
    DP_GALAXIAS: (page, limit) => this.getGalaxiasPagination(page, limit),
    DP_PLANETAS: (page, limit) => this.getPlanetasPagination(page, limit),
    DP_IDIOMAS: (page, limit) => this.getIdiomasPagination(page, limit),
    DP_PROFESORES: (page, limit) => this.getProfesoresPagination(page, limit),
  };

  private async getAllWithPagination(page: number, limit: number): Promise<Record<string, Paginacion<Parameters>>> {
    const [
      categoriasResult,
      galaxiasResult,
      planetasResult,
      idiomasResult,
      profesoresResult
    ] = await Promise.all([
      this.getCategoriasPagination(page, limit),
      this.getGalaxiasPagination(page, limit),
      this.getPlanetasPagination(page, limit),
      this.getIdiomasPagination(page, limit),
      this.getProfesoresPagination(page, limit)
    ]);

    return {
      DP_CATEGORIAS: categoriasResult,
      DP_GALAXIAS: galaxiasResult,
      DP_PLANETAS: planetasResult,
      DP_IDIOMAS: idiomasResult,
      DP_PROFESORES: profesoresResult,
    };
  }

  private async getAll(): Promise<Record<string, Parameters[]>> {
    const [
      categorias,
      galaxias,
      planetas,
      idiomas,
      profesores
    ] = await Promise.all([
      this.getCategorias(),
      this.getGalaxias(),
      this.getPlanetas(),
      this.getIdiomas(),
      this.getProfesores()
    ]);

    return {
      DP_CATEGORIAS: categorias,
      DP_GALAXIAS: galaxias,
      DP_PLANETAS: planetas,
      DP_IDIOMAS: idiomas,
      DP_PROFESORES: profesores,
    };
  }

  private async getCategorias(): Promise<Parameters[]> {
    const categorias: Categoria[] = await this.categoriaService.listarCategorias();
    return this.transformToParameter(categorias, 'nombre', 'CATE');
  }

  private async getCategoriasPagination(page: number, limit: number): Promise<Paginacion<Parameters>> {
    const allCategorias: Categoria[] = await this.categoriaService.listarCategorias();
    const transformedItems = this.transformToParameter(allCategorias, 'nombre', 'CATE');
    
    const total = transformedItems.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedItems = transformedItems.slice(startIndex, endIndex);
    
    return new Paginacion<Parameters>(
      paginatedItems,
      page,
      limit,
      total,
      totalPages,
      page < totalPages,
      page > 1
    );
  }

  private async getGalaxias(): Promise<Parameters[]> {
    const resultado = await this.galaxiasService.listarGalaxia(this.defaultPagination);
    const galaxias: Galaxia[] = this.extraerDatosDeResultado<Galaxia>(resultado);
    return this.transformToParameter(galaxias, 'nombre', 'GALA');
  }

  private async getGalaxiasPagination(page: number, limit: number): Promise<Paginacion<Parameters>> {
    const pagination = { page, limit };
    const resultado = await this.galaxiasService.listarGalaxia(pagination);
    const galaxias: Galaxia[] = this.extraerDatosDeResultado<Galaxia>(resultado);
    const transformedItems = this.transformToParameter(galaxias, 'nombre', 'GALA');
    
    const total = transformedItems.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedItems = transformedItems.slice(startIndex, endIndex);
    
    return new Paginacion<Parameters>(
      paginatedItems,
      page,
      limit,
      total,
      totalPages,
      page < totalPages,
      page > 1
    );
  }

  private async getPlanetas(): Promise<Parameters[]> {
    const resultado = await this.planetaService.listarPlanetas(this.defaultPagination);
    const planetas: Planeta[] = this.extraerDatosDeResultado<Planeta>(resultado);
    return this.transformToParameter(planetas, 'nombre', 'PLAN');
  }

  private async getPlanetasPagination(page: number, limit: number): Promise<Paginacion<Parameters>> {
    const pagination = { page, limit };
    const resultado = await this.planetaService.listarPlanetas(pagination);
    const planetas: Planeta[] = this.extraerDatosDeResultado<Planeta>(resultado);
    const transformedItems = this.transformToParameter(planetas, 'nombre', 'PLAN');
    
    const total = transformedItems.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedItems = transformedItems.slice(startIndex, endIndex);
    
    return new Paginacion<Parameters>(
      paginatedItems,
      page,
      limit,
      total,
      totalPages,
      page < totalPages,
      page > 1
    );
  }

  private async getIdiomas(): Promise<Parameters[]> {
    const idiomas: Idioma[] = await this.idiomaService.listarIdiomas();
    return this.transformToParameter(idiomas, 'nombre', 'IDIO');
  }

  private async getIdiomasPagination(page: number, limit: number): Promise<Paginacion<Parameters>> {
    const allIdiomas: Idioma[] = await this.idiomaService.listarIdiomas();
    const transformedItems = this.transformToParameter(allIdiomas, 'nombre', 'IDIO');
    
    const total = transformedItems.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedItems = transformedItems.slice(startIndex, endIndex);
    
    return new Paginacion<Parameters>(
      paginatedItems,
      page,
      limit,
      total,
      totalPages,
      page < totalPages,
      page > 1
    );
  }

  private async getProfesores(): Promise<Parameters[]> {
    const resultado = await this.profesorService.listarProfesores();
    const profesores: Profesor[] = this.extraerDatosDeResultado<Profesor>(resultado);
    return this.transformProfesores(profesores);
  }

  private async getProfesoresPagination(page: number, limit: number): Promise<Paginacion<Parameters>> {
    const allProfesores = await this.profesorService.listarProfesores();
    const profesores: Profesor[] = this.extraerDatosDeResultado<Profesor>(allProfesores);
    const transformedItems = this.transformProfesores(profesores);
    
    const total = transformedItems.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedItems = transformedItems.slice(startIndex, endIndex);
    
    return new Paginacion<Parameters>(
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

  private transformProfesores(profesores: Profesor[]): Parameters[] {
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