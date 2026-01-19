// src/http/parameters/parameters.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ParametersService } from '../../../core/services/parameters/parameters.service';

@Controller('parameters')
export class ParametersController {
  constructor(private readonly parametersService: ParametersService) {}

  @Get()
  async getAllParameters() {
    return await this.parametersService.getAllParameters();
  }

  @Get(':type')
  async getParametersByType(@Param('type') type: string) {
    return await this.parametersService.getParametersByType(type);
  }
}