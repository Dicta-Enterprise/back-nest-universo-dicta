import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`El ID proporcionado: "${value}" no es un ObjectId válido.`);
    }
    return value;
  }
}
