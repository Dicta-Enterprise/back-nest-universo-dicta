import { Idioma } from '@entities/idioma/idioma.entity';
import { Prisma, Idioma as PrismaIdioma } from '@prisma/client';

type IdiomaConCursos = Prisma.IdiomaGetPayload<{
  include: {
    cursos: {
      select: { nombre: true };
    };
  };
}>;

export interface IdiomaFactory {
  crearDesdePrisma(prisma: PrismaIdioma): Idioma;
  crearDesdePrismaConidiomas(prisma: IdiomaConCursos): Idioma;
}

export class DefaultIdiomaFactory implements IdiomaFactory {
  crearDesdePrisma(prisma: PrismaIdioma): Idioma {
    return new Idioma(prisma.id, prisma.nombre, prisma.estado);
  }
  crearDesdePrismaConidiomas(prisma: IdiomaConCursos): Idioma {
    return new Idioma(prisma.id, prisma.nombre, prisma.estado);
  }
}
