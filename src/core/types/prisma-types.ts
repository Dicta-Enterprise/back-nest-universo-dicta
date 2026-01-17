/**
 * Tipos para trabajar con Prisma de forma type-safe
 *
 * Estos tipos evitan el uso de 'any' y proporcionan seguridad de tipos
 * sin acoplarse a modelos específicos de Prisma.
 */

/**
 * Filtro para consultas de Prisma
 * Representa las condiciones WHERE en una query
 *
 * @example
 * { estado: true, activo: 'ACTIVO' }
 */
export type PrismaFilter = Record<string, unknown>;

/**
 * Campos a seleccionar en una consulta Prisma
 * Representa el objeto SELECT dinámico
 *
 * @example
 * { id: true, nombre: true, descripcion: true }
 */
export type PrismaSelectFields = Record<string, boolean>;

/**
 * Entidad genérica de Prisma
 * Representa cualquier documento de MongoDB retornado por Prisma
 *
 * Garantiza que tenga al menos un campo 'id'
 */
export interface PrismaEntity extends Record<string, unknown> {
  id: string;
}

/**
 * Campos adicionales dinámicos para una entidad
 * Usado cuando una entidad puede tener propiedades variables
 */
export type AdditionalFields = Record<string, unknown>;
