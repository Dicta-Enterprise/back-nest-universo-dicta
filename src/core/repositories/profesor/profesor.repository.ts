import { Profesor } from "src/core/entities/profesor/profesor.entity";


export interface ProfesorRepository{
    findById(id: string): Promise<Profesor | null>;
    findByNameAndApellido(nombre: string, apellido:string): Promise<Profesor | null>;
    findAllActive(): Promise<Profesor[]>;
    save(profesor: Profesor): Promise<Profesor>;
    update(id: string, profesor: Partial<Profesor>): Promise<Profesor>;
    delete(id: string): Promise<void>;
}