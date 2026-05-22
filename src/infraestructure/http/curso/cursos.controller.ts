import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express'; 
import * as useCase from 'src/application/uses-cases/curso';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import * as dto from 'src/application/dto/curso';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; 
import { RequestListarCurso } from 'src/shared/enums/request-list-curso-enum';
import { ImageProcessingService } from 'src/application/services/image-processing.service';

@ApiTags('Cursos')
@Controller('cursos')
export class CursosController {
  constructor(
    private createUseCase: useCase.CreateCursoUseCase,
    private getAllCursoUseCase: useCase.GetAllCursoUseCase,
    private getOneCursoUseCase: useCase.GetOneCursoUseCase,
    private updateCursoUseCase: useCase.UpdateCursoUseCase,
    private deleteCursoUseCase: useCase.DeleteCursoUseCase,
    private readonly imageProcessingService: ImageProcessingService, 
  ) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([ 
    { name: 'principal', maxCount: 1 },
    { name: 'secundaria', maxCount: 1 },
  ]))
  @ApiConsumes('multipart/form-data') 
  @ApiOperation({ summary: 'Crea un curso procesando 2 archivos físicos desde la PC hacia Cloudinary en 6 versiones WebP' })
  @ApiResponse({ status: 201, description: 'Curso creado con imágenes redimensionadas.' })
  async create(
    @Body() dtoCurso: dto.CreateCursoDto,
    @UploadedFiles() files: { principal?: Express.Multer.File[], secundaria?: Express.Multer.File[] }
  ) {
    if (!files || !files.principal || !files.secundaria) {
      throw new BadRequestException('Se requieren obligatoriamente ambos archivos físicos (principal y secundaria) desde la PC.');
    }

    try {
      const imagenesProcesadas = await this.imageProcessingService.processFromFiles(
        files.principal[0],
        files.secundaria[0]
      );
      
      dtoCurso.imagenes = imagenesProcesadas; 

      if (dtoCurso.precio) dtoCurso.precio = Number(dtoCurso.precio);

      const result = await this.createUseCase.execute(dtoCurso);
      if (result.isFailure) throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);

      return { data: result.getValue(), message: 'Curso creado y procesado correctamente desde archivos locales' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        `Fallo en procesamiento de imágenes: ${message}`, 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([ 
    { name: 'principal', maxCount: 1 },
    { name: 'secundaria', maxCount: 1 },
  ]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualiza curso y redimensiona nuevos archivos físicos si se proporcionan' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCursoDto: dto.UpdateCursoDto,
    @UploadedFiles() files: { principal?: Express.Multer.File[], secundaria?: Express.Multer.File[] } 
  ) {
    const cursoActual = await this.getOneCursoUseCase.execute(id);
    if (cursoActual.isFailure) throw new HttpException('Curso no encontrado', HttpStatus.NOT_FOUND);

    try {
      if (files && (files.principal || files.secundaria)) {
        
        if (files.principal && files.secundaria) {
          updateCursoDto.imagenes = await this.imageProcessingService.processFromFiles(
            files.principal[0],
            files.secundaria[0]
          );
        } else {
          throw new BadRequestException('Para actualizar las imágenes, debes cargar tanto el archivo principal como el secundario en el formulario.');
        }
      }

      if (updateCursoDto.precio) updateCursoDto.precio = Number(updateCursoDto.precio);

      const result = await this.updateCursoUseCase.execute(id, updateCursoDto);
      if (result.isFailure) throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);

      return { data: result, message: 'Curso actualizado correctamente' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    const result = await this.getAllCursoUseCase.execute(RequestListarCurso.LISTAR_CURSOS_ADMIN);
    if (result.isFailure) throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    return { data: result, message: 'Cursos obtenidos.' };
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.getOneCursoUseCase.execute(id);
    if (result.isFailure) throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    return { data: result, message: 'Curso obtenido.' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.deleteCursoUseCase.execute(id);
    if (result.isFailure) throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    return { data: result, message: 'Curso eliminado' };
  }
}