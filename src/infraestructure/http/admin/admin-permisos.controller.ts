import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { AdminGuard } from 'src/shared/guard/admin.guard';
import { ActualizarPermisoCuentaAuth, AuthApiService } from 'src/core/services/auth-api/auth-api.service';

// El panel de administración habla solo con este endpoint (con el login normal). La clave interna
// nunca sale de aquí -- mismo patrón que admin/usuarios y admin/ordenes.
@ApiTags('Admin - Permisos')
@ApiCookieAuth('accessToken')
@Controller('admin/permisos')
@UseGuards(jwtAuthGuard, AdminGuard)
export class AdminPermisosController {
  constructor(private readonly authApi: AuthApiService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista las cuentas asociadas (niños y jóvenes) de toda la plataforma con su permiso.',
  })
  @ApiResponse({ status: 200, description: 'Lista de cuentas asociadas con su permiso.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'Solo administradores.' })
  async listar() {
    const data = await this.authApi.listarCuentasAsociadas();
    return { data, message: 'Cuentas asociadas obtenidas con éxito.' };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza (o crea, si no existía) el permiso de una cuenta asociada.' })
  @ApiResponse({ status: 200, description: 'Permiso actualizado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'Solo administradores.' })
  async actualizar(@Param('id', ParseIntPipe) id: number, @Body() body: ActualizarPermisoCuentaAuth) {
    const data = await this.authApi.actualizarPermisoCuenta(id, body);
    return { data, message: 'Permiso actualizado con éxito.' };
  }
}
