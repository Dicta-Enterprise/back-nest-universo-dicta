import { Injectable } from '@nestjs/common';
import { ParameterItemDto } from 'src/application/dto/parameters/parameter-item.dto';
import { ParametersResponseDto } from 'src/application/dto/parameters/parameters-response.dto';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

import { CategoriaService } from '../categoria/categoria.service';
import { GalaxiasService } from '../galaxia/galaxias.service';
import { PlanetasService } from '../planeta/planetas.service';
import { IdiomaService } from '../idioma/idioma.service';
import { ProfesorService } from '../profesor/profesor.service';

@Injectable()
export class ParametersService {
  private readonly emptyPagination = { page: 1, limit: 1000 };

  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly galaxiaService: GalaxiasService,
    private readonly planetaService: PlanetasService,
    private readonly idiomaService: IdiomaService,
    private readonly profesorService: ProfesorService,
  ) {}

  async getCategorias(): Promise<ParameterItemDto[]> {
    const categorias = await this.categoriaService.listarCategorias();
    return this.mapToParameterItem(categorias, 'nombre', 'CATEGORIA');
  }

  async getGalaxias(): Promise<ParameterItemDto[]> {
    const galaxias = await this.galaxiaService.ListarGalaxia(
      this.emptyPagination,
    );
    return this.mapToParameterItem(galaxias, 'nombre', 'GALAXIA');
  }

  async getPlanetas(): Promise<ParameterItemDto[]> {
    const planetas = await this.planetaService.listarPlanetas(
      this.emptyPagination,
    );
    return this.mapToParameterItem(planetas, 'nombre', 'PLANETA');
  }

  async getIdiomas(): Promise<ParameterItemDto[]> {
    const idiomas = await this.idiomaService.listarIdiomas();
    return this.mapToParameterItem(idiomas, 'nombre', 'IDIOMA');
  }

  async getProfesores(): Promise<ParameterItemDto[]> {
    const profesores = await this.profesorService.listarProfesores();
    return this.mapProfesores(profesores);
  }

  async getAll(): Promise<ParametersResponseDto> {
    try {
      const response = new ParametersResponseDto();

      response.DP_CATEGORIAS = await this.getCategorias();
      response.DP_GALAXIAS = await this.getGalaxias();
      response.DP_PLANETAS = await this.getPlanetas();
      response.DP_IDIOMAS = await this.getIdiomas();
      response.DP_PROFESORES = await this.getProfesores();

      return response;
    } catch (error) {
      throw new BussinesRuleException(
        'Error al obtener los parámetros del sistema',
        5001,
        error,
      );
    }
  }

  private mapToParameterItem<T extends { id: string }>(
    items: T[],
    nameField: keyof T,
    tipo: string,
  ): ParameterItemDto[] {
    if (!Array.isArray(items)) {
      throw new BussinesRuleException(
        'Formato inválido de datos de parámetros',
        5002,
      );
    }

    return items
      .filter(item => item?.id && item[nameField])
      .map(item => ({
        id: item.id,
        value: String(item[nameField]),
        code: this.generarCodigo(tipo, String(item[nameField])),
      }));
  }

  private mapProfesores(
    profesores: {
      id: string;
      nombre?: string;
      apellido_paterno?: string;
      apellido_materno?: string;
    }[],
  ): ParameterItemDto[] {
    if (!Array.isArray(profesores)) {
      throw new BussinesRuleException(
        'Formato inválido de datos de profesores',
        5003,
      );
    }

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

        return {
          id: p.id,
          value: nombreCompleto,
          code: this.generarCodigoProfesor(nombreCompleto),
        };
      });
  }

  private generarCodigo(tipo: string, nombre: string): string {
    const tipoCodigo = tipo.toUpperCase().substring(0, 4);

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

  private generarCodigoProfesor(nombreCompleto: string): string {
    const nombreCodigo = nombreCompleto
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z\s-]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')
      .replace(/_+/g, '_');

    return `P_PROF_${nombreCodigo}`;
  }
}