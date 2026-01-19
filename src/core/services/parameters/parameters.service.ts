import { Injectable, Logger } from '@nestjs/common';
import { ParametersResponseDto } from '../../../application/dto/parameters/parameter-response.dto';
import { CategoriaService } from '../categoria/categoria.service';
import { GalaxiasService } from '../galaxia/galaxias.service';
import { PlanetasService } from '../planeta/planetas.service';
import { IdiomaService } from '../idioma/idioma.service';
import { ProfesorService } from '../profesor/profesor.service';

interface BaseParametro {
  id: number | string;
  nombre: string;
}

interface Profesor {
  id: number | string;
  nombre: string;
  apellido_paterno?: string;
  apellido_materno?: string;
}

interface IdValueResponse {
  id: number | string;
  value: string;
  code: string;
}

@Injectable()
export class ParametersService {
  private readonly logger = new Logger(ParametersService.name);

  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly galaxiaService: GalaxiasService,
    private readonly planetaService: PlanetasService,
    private readonly idiomaService: IdiomaService,
    private readonly profesorService: ProfesorService,
  ) {}

  async getAllParameters(): Promise<{
    status: string;
    message: string;
    data: ParametersResponseDto;
  }> {
    const response = new ParametersResponseDto();

    try {
      const emptyPagination = { page: 1, limit: 1000 };

      const categorias = await this.categoriaService.listarCategorias();
      const galaxias = await this.galaxiaService.ListarGalaxia(emptyPagination);
      const planetas = await this.planetaService.listarPlanetas(emptyPagination);
      const idiomas = await this.idiomaService.listarIdiomas();
      const profesores = await this.profesorService.listarProfesores();

      response.DP_CATEGORIAS = this.mapToIdValue(
        categorias as BaseParametro[],
        'nombre',
        'CATEGORIA',
      );

      response.DP_GALAXIAS = this.mapToIdValue(
        galaxias as BaseParametro[],
        'nombre',
        'GALAXIA',
      );

      response.DP_PLANETAS = this.mapToIdValue(
        planetas as BaseParametro[],
        'nombre',
        'PLANETA',
      );

      response.DP_IDIOMAS = this.mapToIdValue(
        idiomas as BaseParametro[],
        'nombre',
        'IDIOMA',
      );

      response.DP_PROFESORES = this.mapProfesores(
        profesores as Profesor[],
      );

      return {
        status: 'success',
        message: 'Parámetros obtenidos exitosamente',
        data: response,
      };
    } catch (error) {
      this.logger.error('Error al obtener parámetros', (error as Error).stack);
      return {
        status: 'error',
        message: 'Error al obtener los parámetros',
        data: response,
      };
    }
  }

  private mapToIdValue<T extends BaseParametro>(
    items: T[],
    nameField: keyof T,
    tipo?: string,
  ): IdValueResponse[] {
    if (!Array.isArray(items)) return [];

    return items
      .filter(item => item?.id && item[nameField])
      .map(item => ({
        id: item.id,
        value: String(item[nameField]),
        code: tipo
          ? this.generarCodigo(tipo, String(item[nameField]))
          : '',
      }));
  }

  private mapProfesores(profesores: Profesor[]): IdValueResponse[] {
    if (!Array.isArray(profesores)) return [];

    return profesores
      .filter(p => p?.id && p?.nombre)
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

    let nombreCodigo = nombre
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z\s-]/g, '')
      .trim();

    nombreCodigo = nombreCodigo
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')
      .replace(/_+/g, '_');

    return `P_${tipoCodigo}_${nombreCodigo}`;
  }

  private generarCodigoProfesor(nombreCompleto: string): string {
    let nombreCodigo = nombreCompleto
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z\s-]/g, '')
      .trim();

    nombreCodigo = nombreCodigo
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')
      .replace(/_+/g, '_');

    return `P_PROF_${nombreCodigo}`;
  }

  async getParametersByType(
    type: string,
  ): Promise<{
    status: string;
    message: string;
    data: IdValueResponse[];
  }> {
    const emptyPagination = { page: 1, limit: 1000 };

    try {
      let data: IdValueResponse[] = [];

      switch (type.toLowerCase()) {
        case 'categorias':
          data = this.mapToIdValue(
            (await this.categoriaService.listarCategorias()) as BaseParametro[],
            'nombre',
            'CATEGORIA',
          );
          break;

        case 'galaxias':
          data = this.mapToIdValue(
            (await this.galaxiaService.ListarGalaxia(
              emptyPagination,
            )) as BaseParametro[],
            'nombre',
            'GALAXIA',
          );
          break;

        case 'planetas':
          data = this.mapToIdValue(
            (await this.planetaService.listarPlanetas(
              emptyPagination,
            )) as BaseParametro[],
            'nombre',
            'PLANETA',
          );
          break;

        case 'idiomas':
          data = this.mapToIdValue(
            (await this.idiomaService.listarIdiomas()) as BaseParametro[],
            'nombre',
            'IDIOMA',
          );
          break;

        case 'profesores':
          data = this.mapProfesores(
            (await this.profesorService.listarProfesores()) as Profesor[],
          );
          break;

        default:
          return {
            status: 'error',
            message: `Tipo '${type}' no válido`,
            data: [],
          };
      }

      return {
        status: 'success',
        message: `Parámetros de ${type} obtenidos exitosamente`,
        data,
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener parámetros de tipo ${type}`,
        (error as Error).stack,
      );
      return {
        status: 'error',
        message: `Error al obtener ${type}`,
        data: [],
      };
    }
  }
}