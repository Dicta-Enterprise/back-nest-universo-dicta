import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreatePlanetaDto } from './create-planeta.dto';

export class CreateMultiplesPlanetaDto {
  @ApiProperty({
    description: 'Lista de planetas a crear',
    type: [CreatePlanetaDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debes enviar al menos un planeta' })
  @ValidateNested({ each: true })
  @Type(() => CreatePlanetaDto)
  planetas: CreatePlanetaDto[];
}
