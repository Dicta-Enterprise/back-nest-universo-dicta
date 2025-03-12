import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanetaDto } from './create-planeta.dto';
import { IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlanetaDto extends PartialType(CreatePlanetaDto) {
  
  @ApiPropertyOptional({
    description: 'ID de la galaxia a la que pertenece el planeta',
    example: '60b8d295f1d3c40015b8f3c9',
  })
  @IsOptional()
  @IsMongoId({ message: 'El ID de la galaxia debe ser un ObjectId válido.' })
  galaxiaId?: string;
}

