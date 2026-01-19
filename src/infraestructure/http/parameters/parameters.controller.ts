import { Controller, Get, Param } from '@nestjs/common';
import { ParametersService } from '../../../core/services/parameters/parameters.service';
import { ParametersResponseDto } from '../../../application/dto/parameters/parameter-response.dto';
import { ParameterItemDto } from '../../../application/dto/parameters/parameters.dto';

@Controller('parameters')
export class ParametersController {
  constructor(
    private readonly parametersService: ParametersService,
  ) {}

  @Get()
  async getAllParameters(): Promise<{
    status: string;
    message: string;
    data: ParametersResponseDto;
  }> {
    return this.parametersService.getAllParameters();
  }

  @Get(':type')
  async getParametersByType(
    @Param('type') type: string,
  ): Promise<{
    status: string;
    message: string;
    data: ParameterItemDto[];
  }> {
    return this.parametersService.getParametersByType(type);
  }
}
