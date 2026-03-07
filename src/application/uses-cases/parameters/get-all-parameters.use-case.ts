import { Injectable } from '@nestjs/common';
import { Result } from 'src/shared/domain/result/result';
import { ParametersService } from 'src/core/services/parameters/parameters.service';
import { Parameters } from 'src/core/entities/parameters/parameters.entity';
import { GetParametersPaginationDto } from 'src/application/dto/parameters/parameters.dto';

@Injectable()
export class GetParametersUseCase {
  constructor(
    private readonly parametersService: ParametersService,
  ) {}

  async execute(query: GetParametersPaginationDto): Promise<Result<Parameters[] | Record<string, Parameters[]>>> {
    try {
      const data = await this.parametersService.getParameters(query?.type);
      return Result.ok(data);
    } catch (error) {
      return Result.fail(error);
    }
  }
}