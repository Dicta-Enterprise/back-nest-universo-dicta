import { Profesor } from "src/core/entities/profesor/profesor.entity";


export interface ProfesorRepository{
    findById(id: string): Promise<Profesor | null>;
    findByDni(dni: string): Promise<Profesor | null>;
    findByApellidos(apellido_paterno: string, apellido_materno:string): Promise<Profesor | null>;
    findAllActive(): Promise<Profesor[]>;
    save(profesor: Profesor): Promise<Profesor>;
    update(id: string, profesor: Partial<Profesor>): Promise<Profesor>;
    delete(id: string, estado_p: boolean): Promise<Profesor>;
}