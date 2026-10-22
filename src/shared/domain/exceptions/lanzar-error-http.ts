import { HttpException, HttpStatus } from '@nestjs/common';
import { BussinesRuleException } from './business-rule.exception';

export function lanzarErrorHttp(error: Error): never {
  if (error instanceof BussinesRuleException) {
    throw new HttpException(error.message, error.errorCode);
  }
  throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
}
