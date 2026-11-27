import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as dto from 'src/application/dto/blockchain-prueba';
import { envs } from 'src/config/envs';
import { BlockchainService } from 'src/core/services/blockchain/blockchain.service';
import { PinataService } from 'src/core/services/blockchain/pinata.service';
import { PrivyService } from 'src/core/services/blockchain/privy.service';
import { AdminGuard } from 'src/shared/auth/admin.guard';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { lanzarErrorHttp } from 'src/shared/domain/exceptions/lanzar-error-http';

// TEMPORAL: registro manual, sin pasar por la emisión. Se borra después de la prueba de carga
@ApiTags('Blockchain')
@Controller('blockchain-prueba/certificados')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiResponse({ status: 401, description: 'No autenticado o sesión expirada.' })
@ApiResponse({ status: 403, description: 'Necesitas permisos de administrador.' })
@ApiResponse({ status: 502, description: 'No se pudo completar la operación en blockchain o en IPFS.' })
export class BlockchainPruebaController {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly pinataService: PinataService,
    private readonly privyService: PrivyService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registra un certificado manualmente en la blockchain, en la wallet de Privy del titular',
    description: 'Obtiene o crea la wallet en Privy, sube los metadatos a IPFS y registra el certificado.',
  })
  @ApiResponse({ status: 201, description: 'Certificado registrado en blockchain.' })
  async registrar(@Body() dtoRegistro: dto.RegistrarCertificadoPruebaDto) {
    const data = await this.ejecutar(async () => {
      const walletDestino = await this.privyService.obtenerOCrearWallet(
        dtoRegistro.emailTitular,
      );
      const metadatos = await this.subirMetadatos(dtoRegistro);
      const registro = await this.blockchainService.registrarCertificado(
        dtoRegistro.codigoCertificado,
        metadatos.uri,
        walletDestino,
      );
      return { ...registro, walletDestino, metadatos };
    });
    return { data, message: 'Certificado registrado en blockchain.' };
  }

  @Get(':tokenId')
  @ApiParam({ name: 'tokenId', description: 'Número del certificado dentro del contrato.' })
  @ApiOperation({ summary: 'Consulta en la blockchain si un certificado existe y si está revocado' })
  @ApiResponse({ status: 200, description: 'Estado obtenido de la blockchain.' })
  async consultar(@Param('tokenId', ParseIntPipe) tokenId: number) {
    const data = await this.ejecutar(() =>
      this.blockchainService.consultarCertificado(String(tokenId)),
    );
    return { data, message: 'Estado obtenido de la blockchain.' };
  }

  @Patch(':tokenId/revocar')
  @ApiParam({ name: 'tokenId', description: 'Número del certificado dentro del contrato.' })
  @ApiOperation({ summary: 'Revoca un certificado en la blockchain por su tokenId' })
  @ApiResponse({ status: 200, description: 'Certificado revocado en blockchain.' })
  async revocar(
    @Param('tokenId', ParseIntPipe) tokenId: number,
    @Body() dtoRevocar: dto.RevocarCertificadoPruebaDto,
  ) {
    const data = await this.ejecutar(() =>
      this.blockchainService.revocarCertificado(
        `prueba-token-${tokenId}`,
        String(tokenId),
        dtoRevocar.motivo,
      ),
    );
    return { data, message: 'Certificado revocado en blockchain.' };
  }

  @Post(':tokenId/reemitir')
  @ApiParam({ name: 'tokenId', description: 'Número del certificado que se reemplaza.' })
  @ApiOperation({
    summary: 'Revoca un certificado y registra uno nuevo en su lugar',
    description: 'Sube los metadatos del nuevo a IPFS. La revocación y el registro ocurren en una sola transacción.',
  })
  @ApiResponse({ status: 201, description: 'Certificado reemitido en blockchain.' })
  async reemitir(
    @Param('tokenId', ParseIntPipe) tokenId: number,
    @Body() dtoReemitir: dto.ReemitirCertificadoPruebaDto,
  ) {
    const data = await this.ejecutar(async () => {
      const walletDestino = await this.privyService.obtenerOCrearWallet(
        dtoReemitir.emailTitular,
      );
      const metadatos = await this.subirMetadatos(dtoReemitir);
      const registro = await this.blockchainService.reemitirCertificado(
        String(tokenId),
        dtoReemitir.codigoCertificado,
        metadatos.uri,
        walletDestino,
        dtoReemitir.motivo,
      );
      return { ...registro, walletDestino, metadatos };
    });
    return { data, message: 'Certificado reemitido en blockchain.' };
  }

  private subirMetadatos(datos: dto.RegistrarCertificadoPruebaDto) {
    return this.pinataService.subirMetadatos({
      ...datos,
      fechaEmision: new Date(),
      urlVerificacion: `${envs.urlVerificacionCertificados}/${datos.codigoCertificado}`,
    });
  }

  private async ejecutar<T>(operacion: () => Promise<T>): Promise<T> {
    try {
      return await operacion();
    } catch (error) {
      lanzarErrorHttp(error);
    }
  }
}
