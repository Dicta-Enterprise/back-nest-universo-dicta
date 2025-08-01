import { Injectable } from "@nestjs/common";
import { Curso } from "src/core/entities/curso/curso.entity";
import { CursoRepository } from "src/core/repositories/curso/curso.respository";
import { PrismaService } from "src/core/services/prisma/prisma.service";

@Injectable()
export class CursoPrismaRepository implements CursoRepository{

    constructor(private prisma: PrismaService) {}

    async findById(id: string): Promise<Curso | null> {
        const data = await this.prisma.curso.findUnique({
              where: { id },
              include: {
                profesor: {
                  select: {
                    id: true,
                    nombre: true,
                    dni:false,
                    apellido_materno:true,
                    apellido_paterno:true,
                    estado_p:false,
                    email:true,
              }
            },
            categoria: {
                  select:{
                    id: false,
                    nombre: true,
                    descripcion: true,
                    imagenUrl: false,
                    estado: false,
                  }
                },
          }
        });
        
        return data ? Curso.fromPrisma(data) : null;
    }

    
    async findByName(nombre: string): Promise<Curso | null> {
        const data = await this.prisma.curso.findUnique({
              where: { nombre },
              include: {
                profesor: {
                  select: {
                    id: true,
                    nombre: true,
                    dni:false,
                    apellido_materno:true,
                    apellido_paterno:true,
                    estado_p:false,
                    email:true,
              }
            },
            categoria: {
                  select:{
                    id: false,
                    nombre: true,
                    descripcion: true,
                    imagenUrl: false,
                    estado: false,
                  }
                },
          }
        });
        
        return data ? Curso.fromPrisma(data) : null;
    }

    async findAllActive(): Promise<Curso[]> {
        const categorias = await this.prisma.curso.findMany({
          include: {
            profesor: {
              select: {
                id: true,
                nombre: true,
                dni:false,
                apellido_materno:true,
                apellido_paterno:true,
                estado_p:false,
                email:true,
              }
            },
            categoria: {
                  select:{
                    id: false,
                    nombre: true,
                    descripcion: true,
                    imagenUrl: false,
                    estado: false,
                  }
                },
          }
        });
        const res = Curso.fromPrismaList(categorias);
        return res;
    }

    async save(curso: Curso): Promise<Curso> {

        const data = await this.prisma.curso.create({
              data: {
                nombre: curso.nombre,
                descripcion: curso.descripcion,
                fechaInicio: curso.fechaInicio,
                fechaFinal: curso.fechaFinal,
                precio: curso.precio,
                estado: curso.estado,
                imagen: curso.imagen,
                duracionSemanas: curso.duracionSemanas,
                profesor: { 
                  connect: { 
                    id: curso.profesorId 
                  } 
                }, 
                categoria: { 
                  connect: { 
                    id: curso.categoriaId 
                  } 
                },
              },
              include: {
                profesor: {
                  select:{
                    id: true,
                    nombre: true,
                    dni:false,
                    apellido_materno:true,
                    apellido_paterno:true,
                    estado_p:false,
                    email:true,
                  }
                },
                categoria: {
                  select:{
                    id: false,
                    nombre: true,
                    descripcion: true,
                    imagenUrl: false,
                    estado: false,
                  }
                },
              }
            });
        
            return Curso.fromPrisma(data);
    }

    async update(id: string, curso: Partial<Curso>): Promise<Curso> {

        const dataUpdate: any = {
          nombre: curso.nombre,
          descripcion: curso.descripcion,
          fechaInicio: curso.fechaInicio,
          fechaFinal: curso.fechaFinal,
          precio: curso.precio,
          estado: curso.estado,
          imagen: curso.imagen,
          duracionSemanas: curso.duracionSemanas,
        };

        if (curso.profesorId) {
          dataUpdate.profesor = { 
            connect: { 
              id: curso.profesorId 
            } };
        }

        if (curso.categoriaId) {
          dataUpdate.categoria = { 
            connect: { 
              id: curso.categoriaId 
            } };
        }

        const data = await this.prisma.curso.update({
              where: { id },
              data: dataUpdate,
              include: {
                profesor: {
                  select:{
                    id: true,
                    nombre: true,
                    dni:false,
                    apellido_materno:true,
                    apellido_paterno:true,
                    estado_p:false,
                    email:true,
                  }
                },
                categoria: {
                  select:{
                    id: false,
                    nombre: true,
                    descripcion: true,
                    imagenUrl: false,
                    estado: false,
                  }
                },
              }
            });
        return Curso.fromPrisma(data);
    }
    
    async delete(id: string, estado: boolean): Promise<Curso> {
        const data = await this.prisma.curso.update({
              where: { id },
              data: {
                estado: estado,
              },
        });
        
        return Curso.fromPrisma(data);
    }
    
}