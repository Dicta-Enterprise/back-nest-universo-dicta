import { IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination/pagination.dto';

export class GalaxiaPaginationDto extends PaginationDto {
  @IsOptional()
  @IsMongoId({
    message: 'El idCategoria debe ser un ObjectId válido de MongoDB',
  })
  categoriaId?: string;
}
