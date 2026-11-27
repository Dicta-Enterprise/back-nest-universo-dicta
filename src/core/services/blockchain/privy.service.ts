import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

const PRIVY_API_URL = 'https://api.privy.io/v1';

interface CuentaVinculadaPrivy {
  type: string;
  address?: string;
  chain_type?: string;
  wallet_client?: string;
}

interface UsuarioPrivy {
  id: string;
  linked_accounts: CuentaVinculadaPrivy[];
}

@Injectable()
export class PrivyService {
  private readonly logger = new Logger(PrivyService.name);

  // Devuelve la wallet de Privy vinculada al email; si el usuario no existe, lo crea con su wallet
  async obtenerOCrearWallet(email: string): Promise<string> {
    const correo = email.trim().toLowerCase();
    const usuario =
      (await this.buscarUsuarioPorEmail(correo)) ??
      (await this.crearUsuarioConWallet(correo));

    return this.extraerWallet(usuario);
  }

  private async buscarUsuarioPorEmail(
    email: string,
  ): Promise<UsuarioPrivy | null> {
    const response = await this.llamar('/users/email/address', {
      address: email,
    });

    if (response.status === HttpStatus.NOT_FOUND) {
      return null;
    }

    return this.leerUsuario(response);
  }

  private async crearUsuarioConWallet(email: string): Promise<UsuarioPrivy> {
    const response = await this.llamar('/users', {
      linked_accounts: [{ type: 'email', address: email }],
      wallets: [{ chain_type: 'ethereum' }],
    });

    return this.leerUsuario(response);
  }

  private async llamar(ruta: string, cuerpo: object): Promise<Response> {
    const { appId, appSecret } = this.obtenerCredenciales();
    const credenciales = Buffer.from(`${appId}:${appSecret}`).toString('base64');

    try {
      return await fetch(`${PRIVY_API_URL}${ruta}`, {
        method: 'POST',
        headers: {
          'privy-app-id': appId,
          Authorization: `Basic ${credenciales}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cuerpo),
      });
    } catch {
      throw new BussinesRuleException(
        'No se pudo conectar con Privy',
        HttpStatus.SERVICE_UNAVAILABLE,
        { codigoError: 'PRIVY_NO_DISPONIBLE' },
      );
    }
  }

  private async leerUsuario(response: Response): Promise<UsuarioPrivy> {
    if (!response.ok) {
      this.logger.error(
        `Privy respondió ${response.status}: ${await response.text()}`,
      );
      throw new BussinesRuleException(
        'Error obteniendo la wallet del titular en Privy',
        HttpStatus.BAD_GATEWAY,
        { codigoError: 'PRIVY_ERROR', status: response.status },
      );
    }

    return (await response.json()) as UsuarioPrivy;
  }

  private extraerWallet(usuario: UsuarioPrivy): string {
    const wallets = usuario.linked_accounts.filter(
      (cuenta) =>
        cuenta.type === 'wallet' &&
        cuenta.chain_type === 'ethereum' &&
        cuenta.address,
    );
    // Se prefiere la wallet que crea Privy por sobre otras que el usuario haya vinculado
    const wallet =
      wallets.find((cuenta) => cuenta.wallet_client === 'privy') ?? wallets[0];

    if (!wallet) {
      throw new BussinesRuleException(
        'El usuario de Privy no tiene una wallet de Ethereum',
        HttpStatus.BAD_GATEWAY,
        { codigoError: 'PRIVY_SIN_WALLET', idUsuarioPrivy: usuario.id },
      );
    }

    return wallet.address;
  }

  private obtenerCredenciales(): { appId: string; appSecret: string } {
    if (!envs.privyAppId || !envs.privyAppSecret) {
      throw new BussinesRuleException(
        'No hay credenciales de Privy configuradas',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { codigoError: 'PRIVY_NO_CONFIGURADO' },
      );
    }

    return { appId: envs.privyAppId, appSecret: envs.privyAppSecret };
  }
}
