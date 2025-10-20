import { PrismaFilter } from '../types/prisma-types';

export interface ParameterRegistryConfig {
  /** Clave que se usará en la respuesta JSON (ej: 'DP_CATEGORIAS') */
  key: string;

  /** Nombre de la colección en MongoDB (ej: 'categoria') */
  collection: string;

  /** Filtro opcional para aplicar a la consulta (ej: { estado: true }) */
  filter?: PrismaFilter;

  /**
   * Campos que se deben seleccionar de la colección
   * Por defecto: ['id', 'nombre']
   *
   * Ejemplos:
   * - ['id', 'nombre'] → { id: '123', value: 'Nombre' }
   * - ['id', 'nombre', 'descripcion'] → { id: '123', value: 'Nombre', descripcion: 'Texto...' }
   * - ['id', 'nombre', 'imagen', 'url'] → { id: '123', value: 'Nombre', imagen: 'url...', url: 'http...' }
   */
  fields?: string[];
}

/**
 * Lista de todos los parámetros que el sistema debe retornar
 *
 * IMPORTANTE: Este lugar es el ÚNICO lugar que debes modificar para agregar/quitar parámetros
 */
export const PARAMETER_REGISTRY: ParameterRegistryConfig[] = [
  {
    key: 'DP_CATEGORIAS',
    collection: 'categoria',
    filter: { estado: true },
    // fields: ['id', 'nombre', 'descripcion'], // ← 4 campos: id, nombre (→ value), descripcion, incluso cursos :)
  },
  {
    key: 'DP_GALAXIAS',
    collection: 'galaxia',
    filter: { estado: true },
    // fields: ['id', 'nombre', 'descripcion', 'imagen'], // ← 4 campos
  },
  {
    key: 'DP_PLANETAS',
    collection: 'planeta',
    filter: { estado: 'ACTIVO' },
    // fields: ['id', 'nombre', 'grupo', 'tema'], // ← Puedes elegir los campos que necesites
  },


  // EJEMPLOS de cómo agregar más parámetros:

  // Solo 2 campos (id y nombre por defecto):
  // {
  //   key: 'DP_IDIOMAS',
  //   collection: 'idioma',
  //   fields: ['id', 'nombre', 'cursos']
  // },

  // Con campos personalizados:
  // {
  //   key: 'DP_CURSOS',
  //   collection: 'curso',
  //   filter: { estado: 'ACTIVO' },
  //   fields: ['id', 'nombre', 'descripcion', 'imagen', 'duracion', 'precio'],
  // },
];
