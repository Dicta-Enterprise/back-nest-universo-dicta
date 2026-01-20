import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiParam, 
  ApiResponse, 
  ApiTags
} from '@nestjs/swagger';
import { ParametersService } from '../../../core/services/parameters/parameters.service';
import { ParametersResponseDto } from '../../../application/dto/parameters/parameter-response.dto';
import { ParameterItemDto } from '../../../application/dto/parameters/parameters.dto';

@ApiTags('Parameters') // Esto aparecerá en Swagger
@Controller('parameters')
export class ParametersController {
  constructor(
    private readonly parametersService: ParametersService,
  ) {}

  @Get(['', ':type'])
  @ApiOperation({ 
    summary: 'Obtener todos los parámetros o por tipo específico', 
    description: 'Obtiene todos los parámetros del sistema o solo los de un tipo específico. Si no se especifica tipo, devuelve todos los parámetros.' 
  })
  @ApiParam({
    name: 'type',
    required: false,
    description: 'Tipo de parámetro a obtener',
    enum: ['DP_CATEGORIAS', 'DP_GALAXIAS', 'DP_PLANETAS', 'DP_IDIOMAS', 'DP_PROFESORES'],
    example: 'DP_CATEGORIAS'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Parámetros obtenidos exitosamente',
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Tipo de parámetro no válido' 
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Error interno del servidor' 
  })
  async getParameters(
    @Param('type') type?: string,
  ): Promise<{
    status: string;
    message: string;
    data: ParametersResponseDto | ParameterItemDto[];
  }> {
    return this.parametersService.getParameters(type);
  }
}