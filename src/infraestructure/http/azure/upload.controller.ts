import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { SaveImageStorageUseCase } from 'src/application/uses-cases/azure/save-image-storage.use.case';
import { ValidateFolderPipe } from 'src/shared/pipes/validate-folder.pipe';
import { AllowedFolder } from 'src/shared/types/folder.type';

@Controller('az-upload')
export class UploadController {
  constructor(
    private readonly saveImageStorageUseCase: SaveImageStorageUseCase,
  ) {}

  @Post('upload/:folder')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGenerico(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder', ValidateFolderPipe) folder: AllowedFolder,
  ) {
    const result = await this.saveImageStorageUseCase.execute(file, folder);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: `Imagen de ${folder} subida correctamente`,
    };
  }
}
