import { Profesor } from '@entities/profesor/profesor.entity';
import { Prisma, Profesor as PrismaProfesor } from '@prisma/client';

type ProfesorConCursos = Prisma.ProfesorGetPayload<{
  include: {
    cursos: {
      select: { nombre: true };
    };
  };
}>;

export interface ProfesorFactory {
  crearDesdePrisma(prisma: PrismaProfesor): Profesor;
  crearDesdePrismaConCursos(prisma: ProfesorConCursos): Profesor;
}

export class DefaultProfesorFactory implements ProfesorFactory {
  crearDesdePrisma(prisma: PrismaProfesor): Profesor {
    return new Profesor(
      prisma.id,
      prisma.nombre,
      prisma.dni ?? '',
      prisma.apellido_paterno ?? '',
      prisma.apellido_materno ?? '',
      prisma.estado_p,
      prisma.email,
      [], // 👈 no hay cursos aún
    );
  }

  crearDesdePrismaConCursos(prisma: ProfesorConCursos): Profesor {
    return new Profesor(
      prisma.id,
      prisma.nombre,
      prisma.dni ?? '',
      prisma.apellido_paterno ?? '',
      prisma.apellido_materno ?? '',
      prisma.estado_p,
      prisma.email,
      prisma.cursos.map((c) => c.nombre),
    );
  }
}
