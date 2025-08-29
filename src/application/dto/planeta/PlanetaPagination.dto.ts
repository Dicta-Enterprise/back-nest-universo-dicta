import { IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination/pagination.dto';

export class PlanetaPaginationDto extends PaginationDto {
  @IsOptional()
  @IsMongoId({ message: 'galaxiaId debe ser un ObjectId válido de mongo' })
  galaxiaId?: string;
}
