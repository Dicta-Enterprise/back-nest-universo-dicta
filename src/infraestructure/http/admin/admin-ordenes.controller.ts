import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { AdminGuard } from 'src/shared/guard/admin.guard';
import { ConsultarOrdenesAdminDto } from 'src/application/dto/admin/consultar-ordenes-admin.dto';
import { RegistrarReclamoAdminDto } from 'src/application/dto/admin/registrar-reclamo-admin.dto';
import { TransactionApiService } from 'src/core/services/transaction-api/transaction-api.service';

// Facturación administrativa (documento de Stephan, 17-oct-2026). El panel habla solo con este
// endpoint (login normal); back-nest es quien le presenta la clave interna a back-transaction --
// mismo patrón que admin/usuarios.
@ApiTags('Admin - Órdenes')
@ApiCookieAuth('accessToken')
@Controller('admin/ordenes')
@UseGuards(jwtAuthGuard, AdminGuard)
export class AdminOrdenesController {
  constructor(private readonly transactionApi: TransactionApiService) {}

  @Get()
  @ApiOperation({ summary: 'Historial de órdenes: filtro por usuario y rango de fechas, paginado.' })
  async listar(@Query() query: ConsultarOrdenesAdminDto) {
    const pagina = await this.transactionApi.listarOrdenes(query);
    return { data: pagina, message: 'Órdenes obtenidas con éxito.' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de una orden: pagos, cursos, factura y reclamos.' })
  async obtener(@Param('id', ParseIntPipe) id: number) {
    const orden = await this.transactionApi.obtenerOrden(id);
    return { data: orden, message: 'Orden obtenida con éxito.' };
  }

  @Post(':id/reenviar-comprobante')
  @ApiOperation({ summary: 'Reenvía el correo de confirmación de compra al comprador.' })
  async reenviarComprobante(@Param('id', ParseIntPipe) id: number) {
    const resultado = await this.transactionApi.reenviarComprobante(id);
    return { data: resultado, message: 'Comprobante reenviado con éxito.' };
  }

  @Post(':id/reclamo')
  @ApiOperation({ summary: 'Registra un reclamo sobre la orden, con estado inicial pendiente.' })
  async registrarReclamo(@Param('id', ParseIntPipe) id: number, @Body() dto: RegistrarReclamoAdminDto, @Req() req: Request) {
    const admin = (req as unknown as { user?: { email?: string } }).user;
    const reclamo = await this.transactionApi.registrarReclamo(id, dto.descripcion, admin?.email ?? 'admin');
    return { data: reclamo, message: 'Reclamo registrado con éxito.' };
  }
}
