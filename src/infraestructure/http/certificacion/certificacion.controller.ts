import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as dto from 'src/application/dto/certificacion';
import * as useCase from 'src/application/uses-cases/certificacion';
import { AdminGuard } from 'src/shared/auth/admin.guard';
import { CurrentUser } from 'src/shared/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { UsuarioAutenticado } from 'src/shared/auth/usuario-autenticado.interface';
import { lanzarErrorHttp } from 'src/shared/domain/exceptions/lanzar-error-http';

@ApiTags('Certificaciones')
@Controller('certificaciones')
@ApiResponse({ status: 401, description: 'No autenticado o sesión expirada.' })
export class CertificacionController {
  constructor(
    private emitirUseCase: useCase.EmitirCertificacionUseCase,
    private getMisCertificacionesUseCase: useCase.GetMisCertificacionesUseCase,
    private validarUseCase: useCase.ValidarCertificacionUseCase,
    private anularUseCase: useCase.AnularCertificacionUseCase,
    private reemitirUseCase: useCase.ReemitirCertificacionUseCase,
    private reintentarUseCase: useCase.ReintentarBlockchainCertificacionUseCase,
    private descargarPdfUseCase: useCase.DescargarPdfCertificacionUseCase,
    private obtenerUseCase: useCase.ObtenerCertificacionUseCase,
  ) {}

  @Get(':id/descargar')
  @UseGuards(JwtAuthGuard)
  @ApiProduces('application/pdf')
  @ApiOperation({
    summary: 'Descarga el PDF del certificado',
    description:
      'Entrega el PDF guardado en Bunny Storage (zona según el tipo de certificado). Si todavía no está guardado, lo arma con la plantilla guardada al emitir (datos y QR de validación sobre el archivo base, en las posiciones de configuracion.pdf) y lo sube para la próxima vez. Pueden descargarlo el admin, el padre (los suyos y los de sus hijos) y el hijo con permiso puedeVerCertificados.',
  })
  @ApiParam({ name: 'id', example: '6650f1c2e9b1e8a012345678' })
  @ApiResponse({ status: 200, description: 'El PDF del certificado.' })
  @ApiResponse({ status: 403, description: 'No tiene permiso sobre este certificado.' })
  @ApiResponse({ status: 404, description: 'No existe un certificado con ese id.' })
  @ApiResponse({ status: 409, description: 'El certificado está anulado.' })
  @ApiResponse({ status: 422, description: 'La plantilla no tiene configuracion.pdf válida, su archivo no sirve o el PDF supera 500 KB.' })
  @ApiResponse({ status: 502, description: 'No se pudo descargar el archivo base de la plantilla.' })
  async descargarPdf(
    @Param('id') id: string,
    @CurrentUser() usuario: UsuarioAutenticado,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const result = await this.descargarPdfUseCase.execute(usuario, id);
    if (result.isFailure) lanzarErrorHttp(result.error);

    const { nombreArchivo, contenido } = result.getValue();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${nombreArchivo}"`,
    });
    return new StreamableFile(contenido);
  }

  @Patch(':codigo/anular')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({
    summary: 'Anula un certificado (solo administrador)',
    description:
      'Lo pasa a ANULADA. Si estaba registrado en Polygon, la revocación sigue en segundo plano (estadoBlockchain REGISTRADO → REVOCADO). Después el usuario puede volver a emitirlo.',
  })
  @ApiParam({ name: 'codigo', example: 'CERT-2026-A1B2C3D4E5' })
  @ApiResponse({ status: 200, description: 'Certificado anulado.' })
  @ApiResponse({ status: 403, description: 'Necesitas permisos de administrador.' })
  @ApiResponse({ status: 404, description: 'No existe un certificado con ese código.' })
  @ApiResponse({ status: 409, description: 'Ya está anulado o todavía se está registrando en blockchain.' })
  async anular(
    @Param('codigo') codigo: string,
    @Body() dtoAnular: dto.AnularCertificacionDto,
    @CurrentUser() admin: UsuarioAutenticado,
  ) {
    const result = await this.anularUseCase.execute(admin, codigo, dtoAnular);
    if (result.isFailure) lanzarErrorHttp(result.error);
    return {
      data: result.getValue(),
      message: 'Certificado anulado. La revocación en blockchain está en proceso.',
    };
  }

  @Post(':codigo/reemitir')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({
    summary: 'Reemite un certificado con un código nuevo (solo administrador)',
    description:
      'Anula el certificado y crea uno nuevo para el mismo titular y curso, con el nombre corregido si se envía. En Polygon el token anterior se revoca y el nuevo va a la misma wallet en una sola transacción, en segundo plano.',
  })
  @ApiParam({ name: 'codigo', example: 'CERT-2026-A1B2C3D4E5' })
  @ApiResponse({ status: 201, description: 'Certificado reemitido. Devuelve el certificado nuevo.' })
  @ApiResponse({ status: 403, description: 'Necesitas permisos de administrador.' })
  @ApiResponse({ status: 404, description: 'No existe un certificado con ese código.' })
  @ApiResponse({ status: 409, description: 'Ya está anulado, o no está registrado en blockchain.' })
  async reemitir(
    @Param('codigo') codigo: string,
    @Body() dtoReemitir: dto.ReemitirCertificacionDto,
    @CurrentUser() admin: UsuarioAutenticado,
  ) {
    const result = await this.reemitirUseCase.execute(admin, codigo, dtoReemitir);
    if (result.isFailure) lanzarErrorHttp(result.error);
    return {
      data: result.getValue(),
      message: 'Certificado reemitido. El registro en blockchain está en proceso.',
    };
  }

  // Sin guard a propósito: es la página pública a la que lleva el QR
  @Get('validar/:codigo')
  @ApiOperation({
    summary: 'Valida un certificado por su código (público)',
    description:
      'No requiere sesión. Devuelve los datos públicos del certificado, si está vigente o anulado y su registro en Polygon. La revocación se lee en vivo del contrato.',
  })
  @ApiParam({ name: 'codigo', example: 'CERT-2026-A1B2C3D4E5' })
  @ApiResponse({ status: 200, description: 'Certificado encontrado. El campo valido indica si está vigente.' })
  @ApiResponse({ status: 404, description: 'No existe un certificado con ese código.' })
  async validar(@Param('codigo') codigo: string) {
    const result = await this.validarUseCase.execute(codigo);
    if (result.isFailure) lanzarErrorHttp(result.error);
    return { data: result.getValue(), message: 'Certificado encontrado.' };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Emite un certificado del usuario principal o de una de sus cuentas asociadas',
    description:
      'Solo el usuario principal (padre) puede emitir. El curso debe estar completado. El certificado se guarda al instante y su registro en blockchain queda en proceso (estadoBlockchain PENDIENTE → REGISTRADO o FALLIDO).',
  })
  @ApiResponse({ status: 201, description: 'Certificado emitido. Registro en blockchain en proceso.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 403, description: 'No es el usuario principal, la cuenta asociada no está activa o el curso no le corresponde.' })
  @ApiResponse({ status: 404, description: 'El curso o la cuenta asociada no existen.' })
  @ApiResponse({ status: 409, description: 'Ya existe un certificado emitido para este curso.' })
  @ApiResponse({ status: 422, description: 'El curso no está completado o no hay plantilla activa.' })
  @ApiResponse({ status: 503, description: 'No se pudo conectar con Back Auth o Back Transaction.' })
  async emitir(
    @Body() dtoEmitir: dto.EmitirCertificacionDto,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    const result = await this.emitirUseCase.execute(usuario, dtoEmitir);
    if (result.isFailure) lanzarErrorHttp(result.error);
    return {
      data: result.getValue(),
      message: 'Certificado emitido. El registro en blockchain está en proceso.',
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Lista los certificados del usuario autenticado',
    description:
      'Un usuario principal ve los suyos y los de sus cuentas asociadas. Una cuenta asociada ve solo los suyos, si tiene el permiso puedeVerCertificados. urlCertificado es el link de descarga del PDF.',
  })
  @ApiResponse({ status: 200, description: 'Certificados obtenidos correctamente.' })
  @ApiResponse({ status: 403, description: 'La cuenta asociada no tiene permiso para ver certificados.' })
  async findAll(@CurrentUser() usuario: UsuarioAutenticado) {
    const result = await this.getMisCertificacionesUseCase.execute(usuario);
    if (result.isFailure) lanzarErrorHttp(result.error);
    return { data: result.getValue(), message: 'Certificados obtenidos.' };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Detalle de un certificado',
    description:
      'Pueden verlo el admin, el padre (los suyos y los de sus hijos) y el hijo con permiso puedeVerCertificados. urlCertificado es el link de descarga del PDF.',
  })
  @ApiParam({ name: 'id', example: '6650f1c2e9b1e8a012345678' })
  @ApiResponse({ status: 200, description: 'Certificado obtenido.' })
  @ApiResponse({ status: 403, description: 'No tiene permiso sobre este certificado.' })
  @ApiResponse({ status: 404, description: 'No existe un certificado con ese id.' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    const result = await this.obtenerUseCase.execute(usuario, id);
    if (result.isFailure) lanzarErrorHttp(result.error);
    return { data: result.getValue(), message: 'Certificado obtenido.' };
  }

  @Post(':codigo/reintentar-blockchain')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Reintenta lo que quedó pendiente en blockchain (admin o el usuario dueño)',
    description:
      'Sirve para un registro FALLIDO, un PENDIENTE trabado (más de 10 minutos), una reemisión fallida o una revocación que no llegó al contrato. No envía dos veces la misma transacción: si la anterior ya se confirmó, solo actualiza el certificado.',
  })
  @ApiParam({ name: 'codigo', example: 'CERT-2026-A1B2C3D4E5' })
  @ApiResponse({ status: 201, description: 'Reintento en proceso.' })
  @ApiResponse({ status: 403, description: 'No es administrador ni el dueño del certificado.' })
  @ApiResponse({ status: 404, description: 'No existe un certificado con ese código.' })
  @ApiResponse({ status: 409, description: 'No hay nada que reintentar, todavía está en proceso, o el reintento corresponde a otro certificado o usuario.' })
  async reintentarBlockchain(
    @Param('codigo') codigo: string,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    const result = await this.reintentarUseCase.execute(usuario, codigo);
    if (result.isFailure) lanzarErrorHttp(result.error);
    return {
      data: result.getValue(),
      message: 'Reintento en proceso. Consulta el certificado en unos segundos.',
    };
  }
}
