import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as useCase from 'src/application/uses-cases/blockchain';
import { AdminGuard } from 'src/shared/auth/admin.guard';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { lanzarErrorHttp } from 'src/shared/domain/exceptions/lanzar-error-http';

@ApiTags('Blockchain')
@Controller('blockchain')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiResponse({ status: 401, description: 'No autenticado o sesión expirada.' })
@ApiResponse({ status: 403, description: 'Necesitas permisos de administrador.' })
export class BlockchainController {
  constructor(
    private readonly consultarSaldoUseCase: useCase.ConsultarSaldoBlockchainUseCase,
  ) {}

  @Get('saldo')
  @ApiOperation({
    summary: 'Saldo de la hot wallet que paga el gas (solo administrador)',
    description:
      'Devuelve el saldo en POL, el precio actual del gas, cuánto cuesta registrar un certificado y cuántos alcanzan. saldoBajo es true por debajo de SALDO_MINIMO_POL. El mismo chequeo corre cada hora y deja un aviso en el log.',
  })
  @ApiResponse({ status: 200, description: 'Saldo obtenido de la blockchain.' })
  @ApiResponse({ status: 502, description: 'No se pudo consultar la blockchain.' })
  async saldo() {
    const result = await this.consultarSaldoUseCase.execute();
    if (result.isFailure) lanzarErrorHttp(result.error);
    return { data: result.getValue(), message: 'Saldo obtenido.' };
  }
}
