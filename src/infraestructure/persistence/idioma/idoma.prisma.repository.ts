import { Injectable } from '@nestjs/common';
import { Idioma } from 'src/core/entities/idioma/idioma.entity';
import { IdiomaRepository } from 'src/core/repositories/idioma/idioma.repostitory';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class IdiomaPrismaRepository implements IdiomaRepository {

  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Idioma | null> {
    const data = await this.prisma.idioma.findUnique({
         where: { id },
       });
   
       return data ? Idioma.fromPrisma(data) : null;
  }



  async findByName(nombre: string): Promise<Idioma | null> {
    const data = await this.prisma.idioma.findUnique({
      where: { nombre },
    })

    return data ? Idioma.fromPrisma(data) : null;
  }


  async findAllActive(): Promise<Idioma[]> {
    const idiomas = await this.prisma.idioma.findMany(); 
    const result = Idioma.fromPrismaList(idiomas);  
    return result;  
  }
  

  
  async save(idioma: Idioma): Promise<Idioma> {
    
    const data = await this.prisma.idioma.create({
      data: {
        nombre: idioma.nombre,
        estado: idioma.estado,
      },
    })

    return Idioma.fromPrisma(data);
  }


  async update(id: string, idioma: Partial<Idioma>): Promise<Idioma> {
    const data = await this.prisma.idioma.update({
      where: { id }, 
      data: {
        nombre: idioma.nombre, 
        estado: idioma.estado,
      },
    });

    return Idioma.fromPrisma(data);
  }

  async delete(id: string, estado: boolean): Promise<Idioma> {
    console.log("Metodo delete")
         const data = await this.prisma.idioma.update({
          where: { id },
          data: {
            estado: estado,
          },
        });
        return Idioma.fromPrisma(data);
  }
}
