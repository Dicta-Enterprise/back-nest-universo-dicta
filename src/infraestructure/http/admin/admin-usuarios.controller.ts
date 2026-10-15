import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { AdminGuard } from 'src/shared/guard/admin.guard';
import { ConsultarUsuariosAdminDto } from 'src/application/dto/admin/consultar-usuarios-admin.dto';
import { AuthApiService } from 'src/core/services/auth-api/auth-api.service';

// El panel de administración habla solo con este endpoint (con el login normal). La clave interna
// nunca sale de aquí: es back-nest quien se la presenta a back-auth.
@ApiTags('Admin - Usuarios')
@ApiCookieAuth('accessToken')
@Controller('admin/usuarios')
@UseGuards(jwtAuthGuard, AdminGuard)
export class AdminUsuariosController {
  constructor(private readonly authApi: AuthApiService) {}

  @Get()
  @ApiOperation({ summary: 'Lista los usuarios de la LMS (padres, niños y jóvenes) con filtros y paginación.' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'Solo administradores.' })
  @ApiResponse({ status: 502, description: 'El servicio de autenticación respondió con un error.' })
  @ApiResponse({ status: 503, description: 'No se pudo conectar con el servicio de autenticación.' })
  async listar(@Query() query: ConsultarUsuariosAdminDto) {
    const lista = await this.authApi.listarUsuarios(query);
    return { data: lista, message: 'Usuarios obtenidos con éxito.' };
  }
}
