import { Injectable } from "@nestjs/common";
import { Profesor } from "src/core/entities/profesor/profesor.entity";
import { ProfesorRepository } from "src/core/repositories/profesor/profesor.repository";
import { PrismaService } from "src/core/services/prisma/prisma.service";

@Injectable()
export class ProfesorPrismaRepository implements ProfesorRepository{

    constructor(private prisma: PrismaService){}


    async findByDni(dni: string): Promise<Profesor | null> {
        const data = await this.prisma.profesor.findUnique({
            where: { dni },
            include: {
            cursos: {
                select: {
                nombre: true,
                },
              },
            },
        });
        
        return data ? Profesor.fromPrisma(data) : null;
    }

    async findById(id: string): Promise<Profesor | null> {
        const data = await this.prisma.profesor.findUnique({
            where: { id },
            include: {
            cursos: {
                select: {
                nombre: true,
                },
              },
            },
        });
        
        return data ? Profesor.fromPrisma(data) : null;
    }


    async findByApellidos(apellido_paterno: string, apellido_materno: string): Promise<Profesor | null> {
        const data = await this.prisma.profesor.findFirst({
            where: { apellido_paterno, apellido_materno },
            include: {
            cursos: {
                select: {
                nombre: true,
                },
              },
            },
        });
        
        return data ? Profesor.fromPrisma(data) : null;
    }
    
    async findAllActive(): Promise<Profesor[]> {
        const profesores = await this.prisma.profesor.findMany({
            include: {
            cursos: {
                select: {
                nombre: true,
                },
              },
            },
        });
        
        const respuesta = Profesor.fromPrismaList(profesores);
        
        return respuesta;
    }
    
    
    async save(profesor: Profesor): Promise<Profesor> {
        const data = await this.prisma.profesor.create({
            data: {
                nombre: profesor.nombre,
                dni: profesor.dni,
                apellido_paterno: profesor.apellido_paterno,
                apellido_materno: profesor.apellido_materno,
                estado_p: profesor.estado_p,
                email: profesor.email,
              },
            });
        
        return Profesor.fromPrisma(data);
    }

    async delete(id: string, estado: boolean): Promise<Profesor>{
        const data = await this.prisma.profesor.update({
            where: { id },
            data: {
                estado_p: estado,
            }
        });

        return Profesor.fromPrisma(data);
    }
    
    async update(id: string, profesor: Partial<Profesor>): Promise<Profesor> {

        const uniquesCount = await this.prisma.profesor.findMany({
            where: {
                OR: [
                    {email: profesor.email},
                    {dni: profesor.dni},
                    {
                        AND: [
                            { apellido_paterno: profesor.apellido_paterno },
                            { apellido_materno: profesor.apellido_materno },
                        ]
                    }
                ]
            }
        })

        if (uniquesCount.length > 0){
            throw new Error('Error, los valores unicos(Email y Apellidos) ya se encuentran registrados.');
        }

        const data = await this.prisma.profesor.update({
            where: { id },
            data: {
                nombre: profesor.nombre,
                dni: profesor.dni,
                apellido_paterno: profesor.apellido_paterno,
                apellido_materno: profesor.apellido_materno,
                estado_p: profesor.estado_p,
                email: profesor.email,
            },
        });
        return Profesor.fromPrisma(data);
    }

}