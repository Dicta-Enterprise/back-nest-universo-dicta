import { PlanetaValidations } from '../validations/planeta-validations';
import { EstadoGenerico } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePlanetaDto {
  @PlanetaValidations.nombre()
  nombre: string;

  @PlanetaValidations.descripcion()
  descripcion: string;

  @PlanetaValidations.imagen()
  imagen: string;

  @PlanetaValidations.galaxiaId()
  galaxiaId: string;

  @PlanetaValidations.estado()
  estado?: EstadoGenerico;

  @PlanetaValidations.fechaCreacion()
  @Type(() => Date)
  fechaCreacion?: Date;
}
