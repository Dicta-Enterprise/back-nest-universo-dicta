import { Injectable } from "@nestjs/common";
import { Profesor } from "src/core/entities/profesor/profesor.entity";
import { ProfesorRepository } from "src/core/repositories/profesor/profesor.repository";
import { PrismaService } from "src/core/services/prisma/prisma.service";

@Injectable()
export class ProfesorPrismaRepository implements ProfesorRepository{

    constructor(private prisma: PrismaService){}
    
    

    async findById(id: string): Promise<Profesor | null> {
        const data = await this.prisma.profesor.findUnique({
            where: { id },
        });
        
        return data ? Profesor.fromPrisma(data) : null;
    }


    async findByNameAndApellido(nombre: string, apellido: string): Promise<Profesor | null> {
        const data = await this.prisma.profesor.findFirst({
            where: { nombre, apellido },
        });
        
        return data ? Profesor.fromPrisma(data) : null;
    }
    
    async findAllActive(): Promise<Profesor[]> {
        const profesores = await this.prisma.profesor.findMany();
        
        const respuesta = Profesor.fromPrismaList(profesores);
        
        return respuesta;
    }
    
    
    async save(profesor: Profesor): Promise<Profesor> {
        const data = await this.prisma.profesor.create({
            data: {
                nombre: profesor.nombre,
                apellido: profesor.apellido,
                email: profesor.email,
              },
            });
        
        return Profesor.fromPrisma(data);
    }

    async delete(id: string): Promise<void>{
        await this.prisma.profesor.delete({
            where: { id },
        });
    }
    
    async update(id: string, profesor: Partial<Profesor>): Promise<Profesor> {
        const data = await this.prisma.profesor.update({
            where: { id },
            data: {
                nombre: profesor.nombre,
                apellido: profesor.apellido,
                email: profesor.email,
            },
        });
        return Profesor.fromPrisma(data);
    }

}