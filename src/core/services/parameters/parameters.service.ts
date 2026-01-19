// src/core/services/parameters/parameters.service.ts
import { Injectable } from '@nestjs/common';
import { ParametersResponseDto } from '../../../application/dto/parameters/parameter-response.dto';
import { CategoriaService } from '../categoria/categoria.service';
import { GalaxiasService } from '../galaxia/galaxias.service';
import { PlanetasService } from '../planeta/planetas.service';
import { IdiomaService } from '../idioma/idioma.service';
import { ProfesorService } from '../profesor/profesor.service';

@Injectable()
export class ParametersService {
  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly galaxiaService: GalaxiasService,
    private readonly planetaService: PlanetasService,
    private readonly idiomaService: IdiomaService,
    private readonly profesorService: ProfesorService
  ) {}

  async getAllParameters(): Promise<{status: string, message: string, data: ParametersResponseDto}> {
    const response = new ParametersResponseDto();
    
    try {
      const emptyPagination = { page: 1, limit: 1000 };
      
      const categorias = await this.categoriaService.listarCategorias();
      const galaxias = await this.galaxiaService.ListarGalaxia(emptyPagination);
      const planetas = await this.planetaService.listarPlanetas(emptyPagination);
      const idiomas = await this.idiomaService.listarIdiomas();
      const profesores = await this.profesorService.listarProfesores();
      
      response.DP_CATEGORIAS = this.mapToIdValue(categorias, 'nombre', 'CATEGORIA');
      response.DP_GALAXIAS = this.mapToIdValue(galaxias, 'nombre', 'GALAXIA');
      response.DP_PLANETAS = this.mapToIdValue(planetas, 'nombre', 'PLANETA');
      response.DP_IDIOMAS = this.mapToIdValue(idiomas, 'nombre', 'IDIOMA');
      response.DP_PROFESORES = this.mapProfesores(profesores);
      
      return {
        status: 'success',
        message: 'Parámetros obtenidos exitosamente',
        data: response
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        status: 'error',
        message: 'Error al obtener los parámetros',
        data: response
      };
    }
  }

  private mapToIdValue(items: any[], nameField: string, tipo?: string): any[] {
    if (!Array.isArray(items)) return [];
    
    return items
      .filter(item => item && item.id && item[nameField])
      .map(item => ({
        id: item.id,
        value: item[nameField],
        code: tipo ? this.generarCodigo(tipo, item[nameField]) : ''
      }));
  }

  private mapProfesores(profesores: any[]): any[] {
    if (!Array.isArray(profesores)) return [];
    
    return profesores
      .filter(profesor => profesor && profesor.id && profesor.nombre)
      .map(profesor => {
        const nombreCompleto = [
          profesor.nombre,
          profesor.apellido_paterno,
          profesor.apellido_materno
        ]
          .filter(Boolean)
          .join(' ');
        
        const nombreMostrar = nombreCompleto || profesor.nombre;
        
        return {
          id: profesor.id,
          value: nombreMostrar,
          code: this.generarCodigoProfesor(nombreCompleto)
        };
      });
  }

  private generarCodigo(tipo: string, nombre: string): string {
    const tipoCodigo = tipo.toUpperCase().substring(0, 4);
    
    let nombreCodigo = nombre
      .toUpperCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^A-Z\s-]/g, '') 
      .trim();
    
    nombreCodigo = nombreCodigo
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_'); 
    
    nombreCodigo = nombreCodigo.replace(/_+/g, '_');
    
    return `P_${tipoCodigo}_${nombreCodigo}`;
  }

  private generarCodigoProfesor(nombreCompleto: string): string {
    let nombreCodigo = nombreCompleto
      .toUpperCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^A-Z\s-]/g, '') 
      .trim();
    
    nombreCodigo = nombreCodigo
      .replace(/\s+/g, '_') 
      .replace(/-+/g, '_'); 
    
    nombreCodigo = nombreCodigo.replace(/_+/g, '_');
    
    return `P_PROF_${nombreCodigo}`;
  }

  async getParametersByType(type: string): Promise<{status: string, message: string, data: any[]}> {
    const emptyPagination = { page: 1, limit: 1000 };
    
    try {
      let data: any[] = [];
      
      switch (type.toLowerCase()) {
        case 'categorias':
          data = this.mapToIdValue(await this.categoriaService.listarCategorias(), 'nombre', 'CATEGORIA');
          break;
        case 'galaxias':
          data = this.mapToIdValue(await this.galaxiaService.ListarGalaxia(emptyPagination), 'nombre', 'GALAXIA');
          break;
        case 'planetas':
          data = this.mapToIdValue(await this.planetaService.listarPlanetas(emptyPagination), 'nombre', 'PLANETA');
          break;
        case 'idiomas':
          data = this.mapToIdValue(await this.idiomaService.listarIdiomas(), 'nombre', 'IDIOMA');
          break;
        case 'profesores':
          const profesores = await this.profesorService.listarProfesores();
          data = this.mapProfesores(profesores);
          break;
        default:
          return {
            status: 'error',
            message: `Tipo '${type}' no válido`,
            data: []
          };
      }
      
      return {
        status: 'success',
        message: `Parámetros de ${type} obtenidos exitosamente`,
        data: data
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        status: 'error',
        message: `Error al obtener ${type}`,
        data: []
      };
    }
  }
}