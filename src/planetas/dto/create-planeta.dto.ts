import { PlanetaValidations } from '../validations/planeta-validations';
import { EstadoGenerico } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanetaDto {
  @ApiProperty({
    description: 'Nombre del planeta',
    example: 'Tierra',
  })
  @PlanetaValidations.nombre()
  nombre: string;

  @ApiProperty({
    description: 'Descripción del planeta',
    example: 'Planeta azul con vida',
  })
  @PlanetaValidations.descripcion()
  descripcion: string;

  @ApiProperty({
    description: 'URL de la imagen del planeta',
    example: 'https://example.com/tierra.jpg',
  })
  @PlanetaValidations.imagen()
  imagen: string;

  @ApiProperty({
    description: 'ID de la galaxia a la que pertenece el planeta',
    example: 'abc123',
  })
  @PlanetaValidations.galaxiaId()
  galaxiaId: string;

  @ApiPropertyOptional({
    description: 'Estado del planeta (ACTIVO o INACTIVO)',
    example: 'ACTIVO',
  })
  @PlanetaValidations.estado()
  estado?: EstadoGenerico;

  @ApiPropertyOptional({
    description: 'Fecha de creación del planeta',
    example: '2025-03-10T12:00:00Z',
  })
  @PlanetaValidations.fechaCreacion()
  @Type(() => Date)
  fechaCreacion?: Date;

}
