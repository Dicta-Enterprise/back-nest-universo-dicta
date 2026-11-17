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
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as useCase from 'src/application/uses-cases/curso';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import * as dto from 'src/application/dto/curso';
import { ApiConsumes, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestListarCurso } from 'src/shared/enums/request-list-curso-enum';
import { ImageProcessingService } from 'src/application/services/image-processing.service';
import { MULTER_HARD_LIMIT_BYTES, validarImagenWebp } from 'src/shared/helper/imagen-webp.helper';
import { BunnyStreamService } from 'src/shared/services/bunny-stream.service';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { OptionalJwtAuthGuard } from 'src/shared/auth/optional-jwt-auth.guard';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { AdminGuard } from 'src/shared/guard/admin.guard';
import { RequestConUsuario } from 'src/shared/auth/usuario-autenticado.interface';
import { TransactionApiService } from 'src/core/services/integraciones/transaction-api.service';
import { Curso, ModuloCurso } from 'src/core/entities/curso/curso.entity';
import { BunnyTokenService } from 'src/core/services/bunny/bunny-token.service';

const MULTER_VIDEO_LIMIT_BYTES = 500 * 1024 * 1024;

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
    private readonly bunnyStreamService: BunnyStreamService,
    private readonly prisma: PrismaService,
    private readonly transactionApiService: TransactionApiService,
    private readonly bunnyTokenService: BunnyTokenService,
  ) {}

  // El candado real: un modulo pago (esGratis=false) solo manda el video si el visitante esta
  // logueado Y ya compro ESE curso. Sin esto, cualquiera podia ver el video con solo saber la
  // url, sin importar si el modulo decia "Premium" -- esGratis era solo una etiqueta visual.
  private aplicarCandado(curso: Curso, idsCursosComprados: string[]): Curso {
    if (!curso.modulos?.length) return curso;

    const tieneAcceso = idsCursosComprados.includes(curso.id);
    curso.modulos = curso.modulos.map((modulo) => {
      if (modulo.esGratis || tieneAcceso) return modulo;
      return new ModuloCurso(modulo.id, modulo.nombre, modulo.orden, modulo.esGratis, undefined, modulo.quizzes, undefined);
    });
    return curso;
  }

  private async idsCursosCompradosDe(req: RequestConUsuario): Promise<string[]> {
    if (!req.user) return [];
    try {
      return await this.transactionApiService.obtenerCursosComprados(req.user.id);
    } catch {
      // Si back-transaction no responde, se trata como "no compro nada" -- un modulo pago no
      // debe quedar abierto por un error del otro servicio.
      return [];
    }
  }

  @Get('publico')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Lista de cursos para Universo Dictariano: los modulos pagos no incluyen el video si el visitante no lo compro.' })
  async findAllPublico(@Req() req: RequestConUsuario) {
    const result = await this.getAllCursoUseCase.execute(RequestListarCurso.LISTAR_CURSOS_ADMIN);
    if (result.isFailure) throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);

    const idsComprados = await this.idsCursosCompradosDe(req);
    // aplicarCandado muta los mismos objetos Curso que ya estan dentro de "result" (_value),
    // asi que devolver "result" tal cual mantiene la forma { data: { _value: [...] } } que
    // espera el frontend, igual que el resto de endpoints de este controlador.
    (result.getValue() as Curso[]).forEach((c) => this.aplicarCandado(c, idsComprados));
    return { data: result, message: 'Cursos obtenidos.' };
  }

  @Get('publico/:id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Curso para Universo Dictariano: los modulos pagos no incluyen el video si el visitante no lo compro.' })
  async findOnePublico(@Param('id', ParseObjectIdPipe) id: string, @Req() req: RequestConUsuario) {
    const result = await this.getOneCursoUseCase.execute(id);
    if (result.isFailure) throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);

    const idsComprados = await this.idsCursosCompradosDe(req);
    this.aplicarCandado(result.getValue() as Curso, idsComprados);
    return { data: result, message: 'Curso obtenido.' };
  }

  // El link firmado de Bunny Stream (Token Authentication): el candado de arriba evita que la
  // RESPUESTA incluya el bunnyVideoId de un modulo que no compraste, pero una vez que SI lo
  // tenes (gratis, o porque compraste), el link de reproduccion de Bunny no pedia nada mas --
  // cualquiera con ese id/link lo podia ver para siempre, sin loguearse. Este endpoint devuelve
  // un link que vence en 1 hora y que Bunny solo acepta si lo firmo este backend. Pedido de
  // Carlos (documento) + Andrea (12 nov 2026).
  @Get('publico/:cursoId/modulos/:moduloId/video-token')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Genera el link firmado (Bunny Token Authentication) para reproducir el video de un modulo, si corresponde acceso.' })
  @ApiResponse({ status: 200, description: 'Link firmado generado.' })
  @ApiResponse({ status: 403, description: 'El modulo es pago y el visitante no compro este curso.' })
  async obtenerVideoToken(
    @Param('cursoId', ParseObjectIdPipe) cursoId: string,
    @Param('moduloId') moduloId: string,
    @Req() req: RequestConUsuario,
  ) {
    const result = await this.getOneCursoUseCase.execute(cursoId);
    if (result.isFailure) throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);

    const curso = result.getValue() as Curso;
    const modulo = curso.modulos?.find((m) => m.id === moduloId);
    if (!modulo) throw new HttpException('Módulo no encontrado', HttpStatus.NOT_FOUND);
    if (!modulo.bunnyVideoId || !modulo.bunnyLibraryId) {
      throw new HttpException('Este módulo no tiene video cargado.', HttpStatus.BAD_REQUEST);
    }

    if (!modulo.esGratis) {
      const idsComprados = await this.idsCursosCompradosDe(req);
      if (!idsComprados.includes(cursoId)) {
        throw new HttpException('Este módulo es pago y no compraste este curso.', HttpStatus.FORBIDDEN);
      }
    }

    const credenciales = this.bunnyStreamService.resolverLibreriaPorId(modulo.bunnyLibraryId);
    const resultado = this.bunnyTokenService.generarTokenReproduccion(modulo.bunnyVideoId, modulo.bunnyLibraryId, credenciales.securityKey);
    return { data: resultado, message: 'Link firmado generado.' };
  }

  @Post(':cursoId/modulos/video')
  @UseInterceptors(FileInterceptor('video', { limits: { fileSize: MULTER_VIDEO_LIMIT_BYTES } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Sube el video de un modulo a la biblioteca de Bunny Stream del curso (segun su categoria/galaxia) y devuelve el id del video' })
  async subirVideoModulo(
    @Param('cursoId', ParseObjectIdPipe) cursoId: string,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    if (!video) throw new BadRequestException('Se requiere el archivo de video.');

    const curso = await this.prisma.curso.findUnique({
      where: { id: cursoId },
      select: { categoriaId: true, planetaId: true },
    });
    if (!curso) throw new BadRequestException('Curso no encontrado.');

    const [categoria, planeta] = await Promise.all([
      curso.categoriaId ? this.prisma.categoria.findUnique({ where: { id: curso.categoriaId }, select: { nombre: true } }) : null,
      curso.planetaId
        ? this.prisma.planeta.findUnique({ where: { id: curso.planetaId }, select: { galaxia: { select: { nombre: true } } } })
        : null,
    ]);
    if (!categoria || !planeta?.galaxia) {
      throw new BadRequestException('El curso necesita tener categoría y planeta (galaxia) asignados para saber a qué biblioteca de Bunny Stream subir el video.');
    }

    const credenciales = this.bunnyStreamService.resolverLibreria(categoria.nombre, planeta.galaxia.nombre);
    const bunnyVideoId = await this.bunnyStreamService.subirVideo(credenciales, video.originalname, video.buffer);
    return {
      data: { bunnyVideoId, bunnyLibraryId: credenciales.libraryId },
      message: 'Video subido correctamente.',
    };
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'principal', maxCount: 1 },
  ], { limits: { fileSize: MULTER_HARD_LIMIT_BYTES } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crea un curso subiendo una imagen (WebP, máx. 80 KB) a Bunny' })
  @ApiResponse({ status: 201, description: 'Curso creado con su imagen.' })
  async create(
    @Body() dtoCurso: dto.CreateCursoDto,
    @UploadedFiles() files: { principal?: Express.Multer.File[] }
  ) {
    if (!files || !files.principal) {
      throw new BadRequestException('Se requiere obligatoriamente el archivo de imagen (principal) desde la PC.');
    }
    validarImagenWebp(files.principal[0], 'principal');

    try {
      const imagenesProcesadas = await this.imageProcessingService.processFromFiles(
        files.principal[0],
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
  ], { limits: { fileSize: MULTER_HARD_LIMIT_BYTES } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualiza curso y la imagen si se proporciona una nueva' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCursoDto: dto.UpdateCursoDto,
    @UploadedFiles() files: { principal?: Express.Multer.File[] }
  ) {
    if (files?.principal) {
      validarImagenWebp(files.principal[0], 'principal');
    }

    const cursoActual = await this.getOneCursoUseCase.execute(id);
    if (cursoActual.isFailure) throw new HttpException('Curso no encontrado', HttpStatus.NOT_FOUND);

    try {
      if (files?.principal) {
        updateCursoDto.imagenes = await this.imageProcessingService.processFromFiles(
          files.principal[0],
        );
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

  // Estas dos rutas (sin "/publico") devuelven el curso/modulo completo, CON el bunnyVideoId de
  // los modulos pagos sin revisar si se compro -- son para el panel admin, no para el sitio
  // publico (ese usa /publico y /publico/:id, que si filtran). Sin este guard, cualquiera que
  // conociera el cursoId/moduloId podia pedirlas directo (sin pasar por el sitio) y sacar el id
  // del video gratis. Pedido de Andrea (12 nov 2026).
  @Get(':id')
  @UseGuards(jwtAuthGuard, AdminGuard)
  @ApiCookieAuth('accessToken')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.getOneCursoUseCase.execute(id);
    if (result.isFailure) throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    return { data: result, message: 'Curso obtenido.' };
  }

  @Get(':cursoId/modulos/:moduloId')
  @UseGuards(jwtAuthGuard, AdminGuard)
  @ApiCookieAuth('accessToken')
  @ApiOperation({ summary: 'Obtiene un módulo específico de un curso (incluye su bunnyVideoId) -- solo admin.' })
  async findOneModulo(
    @Param('cursoId', ParseObjectIdPipe) cursoId: string,
    @Param('moduloId') moduloId: string,
  ) {
    const result = await this.getOneCursoUseCase.execute(cursoId);
    if (result.isFailure) throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);

    const curso = result.getValue();
    const modulo = curso.modulos?.find((m) => m.id === moduloId);
    if (!modulo) throw new HttpException('Módulo no encontrado', HttpStatus.NOT_FOUND);

    return { data: modulo, message: 'Módulo obtenido.' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.deleteCursoUseCase.execute(id);
    if (result.isFailure) throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    return { data: result, message: 'Curso eliminado' };
  }
}