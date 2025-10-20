import { AdditionalFields, PrismaEntity } from '../../types/prisma-types';
export class Parameter {
    id: string;
    value: string;
    [key: string]: unknown; // Permite propiedades adicionales dinámicas

    constructor(id: string, value: string, additionalFields?: AdditionalFields) {
        this.id = id;
        this.value = value;

        // Agregar campos adicionales si existen
        if (additionalFields) {
            Object.assign(this, additionalFields);
        }
    }

    static from(entity: PrismaEntity & { nombre: string }): Parameter {
        const { id, nombre, ...additionalFields } = entity;

        // Crear parameter con id y nombre (→ value)
        return new Parameter(id, nombre as string, additionalFields);
    }

    static fromList(entities: Array<PrismaEntity & { nombre: string }>): Parameter[] {
        return entities.map(entity => Parameter.from(entity));
    }
}