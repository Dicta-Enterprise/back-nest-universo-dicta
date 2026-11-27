import 'dotenv/config';
import * as joi from 'joi';
interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  AZURE_BLOB_STORAGE_ENDPOINT: string;
  AZURE_STORAGE_ACCOUNT_NAME: string;
  AZURE_STORAGE_ACCOUNT_KEY: string;
  AZURE_BLOB_CONTAINER_NAME: string;
  BUNNY_STORAGE_ENDPOINT: string;
  BUNNY_CURSOS_ZONE: string;
  BUNNY_CURSOS_PASSWORD: string;
  BUNNY_CURSOS_CDN_URL: string;
  BUNNY_TEXTURAS_ZONE: string;
  BUNNY_TEXTURAS_PASSWORD: string;
  BUNNY_TEXTURAS_CDN_URL: string;
  JWT_SECRET: string;
  AUTH_API_URL: string;
  TRANSACTION_API_URL: string;
  BLOCKCHAIN_RPC_URL: string;
  BLOCKCHAIN_CHAIN_ID: number;
  CONTRACT_ADDRESS: string;
  HOT_WALLET_PRIVATE_KEY?: string;
  AWS_REGION: string;
  AWS_SECRET_HOT_WALLET: string;
  PINATA_JWT?: string;
  PINATA_GATEWAY: string;
  REDIS_URL: string;
  REDIS_PREFIJO_COLA: string;
  PRIVY_APP_ID?: string;
  PRIVY_APP_SECRET?: string;
  URL_VERIFICACION_CERTIFICADOS: string;
  SALDO_MINIMO_POL: number;
  BUNNY_STORAGE_HOST: string;
  BUNNY_STORAGE_ZONA_NINOS: string;
  BUNNY_STORAGE_CLAVE_NINOS?: string;
  BUNNY_STORAGE_ZONA_JOVENES: string;
  BUNNY_STORAGE_CLAVE_JOVENES?: string;
  BUNNY_STORAGE_ZONA_PADRES: string;
  BUNNY_STORAGE_CLAVE_PADRES?: string;
  BUNNY_STREAM_LIBRERIAS?: string;
  LRS_ENDPOINT: string;
  LRS_KEY: string;
  LRS_SECRET: string;
  INTERNAL_API_KEY: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    AZURE_BLOB_STORAGE_ENDPOINT: joi.string().required(),
    AZURE_STORAGE_ACCOUNT_NAME: joi.string().required(),
    AZURE_STORAGE_ACCOUNT_KEY: joi.string().required(),
    AZURE_BLOB_CONTAINER_NAME: joi.string().required(),
    BUNNY_STORAGE_ENDPOINT: joi.string().required(),
    BUNNY_CURSOS_ZONE: joi.string().required(),
    BUNNY_CURSOS_PASSWORD: joi.string().required(),
    BUNNY_CURSOS_CDN_URL: joi.string().required(),
    BUNNY_TEXTURAS_ZONE: joi.string().required(),
    BUNNY_TEXTURAS_PASSWORD: joi.string().required(),
    BUNNY_TEXTURAS_CDN_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    BLOCKCHAIN_RPC_URL: joi.string().uri().required(),
    BLOCKCHAIN_CHAIN_ID: joi.number().required(),
    CONTRACT_ADDRESS: joi
      .string()
      .pattern(/^0x[0-9a-fA-F]{40}$/)
      .required(),
    HOT_WALLET_PRIVATE_KEY: joi.string().allow('').optional(),
    AWS_REGION: joi.string().default('us-east-1'),
    AWS_SECRET_HOT_WALLET: joi.string().default('mundodictarianiano/hotwallet'),
    PINATA_JWT: joi.string().allow('').optional(),
    PINATA_GATEWAY: joi.string().default('gateway.pinata.cloud'),
    REDIS_URL: joi
      .string()
      .uri({ scheme: ['redis', 'rediss'] })
      .required(),
    REDIS_PREFIJO_COLA: joi.string().required(),
    PRIVY_APP_ID: joi.string().allow('').optional(),
    PRIVY_APP_SECRET: joi.string().allow('').optional(),
    URL_VERIFICACION_CERTIFICADOS: joi
      .string()
      .uri()
      .default('https://example.com/verificar'),
    SALDO_MINIMO_POL: joi.number().min(0).default(5),
    BUNNY_STORAGE_HOST: joi.string().hostname().default('storage.bunnycdn.com'),
    BUNNY_STORAGE_ZONA_NINOS: joi.string().default('certificados-ninos'),
    BUNNY_STORAGE_CLAVE_NINOS: joi.string().allow('').optional(),
    BUNNY_STORAGE_ZONA_JOVENES: joi.string().default('certificados-jovenes'),
    BUNNY_STORAGE_CLAVE_JOVENES: joi.string().allow('').optional(),
    BUNNY_STORAGE_ZONA_PADRES: joi.string().default('certificados-padres'),
    BUNNY_STORAGE_CLAVE_PADRES: joi.string().allow('').optional(),
    AUTH_API_URL: joi.string().default('http://localhost:3002'),
    TRANSACTION_API_URL: joi.string().default('http://localhost:3001'),
    BUNNY_STREAM_LIBRERIAS: joi.string().optional(),
    LRS_ENDPOINT: joi.string().allow('').default(''),
    LRS_KEY: joi.string().allow('').default(''),
    LRS_SECRET: joi.string().allow('').default(''),
    INTERNAL_API_KEY: joi.string().min(16).required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  azureBlobStorageEndpoint: envVars.AZURE_BLOB_STORAGE_ENDPOINT,
  azureStorageAccountName: envVars.AZURE_STORAGE_ACCOUNT_NAME,
  azureStorageAccountKey: envVars.AZURE_STORAGE_ACCOUNT_KEY,
  azureBlobContainerName: envVars.AZURE_BLOB_CONTAINER_NAME,
  bunnyStorageEndpoint: envVars.BUNNY_STORAGE_ENDPOINT,
  bunnyCursosZone: envVars.BUNNY_CURSOS_ZONE,
  bunnyCursosPassword: envVars.BUNNY_CURSOS_PASSWORD,
  bunnyCursosCdnUrl: envVars.BUNNY_CURSOS_CDN_URL,
  bunnyTexturasZone: envVars.BUNNY_TEXTURAS_ZONE,
  bunnyTexturasPassword: envVars.BUNNY_TEXTURAS_PASSWORD,
  bunnyTexturasCdnUrl: envVars.BUNNY_TEXTURAS_CDN_URL,
  jwtSecret: envVars.JWT_SECRET,
  authApiUrl: envVars.AUTH_API_URL,
  transactionApiUrl: envVars.TRANSACTION_API_URL,
  blockchainRpcUrl: envVars.BLOCKCHAIN_RPC_URL,
  blockchainChainId: envVars.BLOCKCHAIN_CHAIN_ID,
  contractAddress: envVars.CONTRACT_ADDRESS,
  hotWalletPrivateKey: envVars.HOT_WALLET_PRIVATE_KEY,
  awsRegion: envVars.AWS_REGION,
  awsSecretHotWallet: envVars.AWS_SECRET_HOT_WALLET,
  pinataJwt: envVars.PINATA_JWT,
  pinataGateway: envVars.PINATA_GATEWAY,
  redisUrl: envVars.REDIS_URL,
  redisPrefijoCola: envVars.REDIS_PREFIJO_COLA,
  privyAppId: envVars.PRIVY_APP_ID,
  privyAppSecret: envVars.PRIVY_APP_SECRET,
  urlVerificacionCertificados: envVars.URL_VERIFICACION_CERTIFICADOS,
  saldoMinimoPol: envVars.SALDO_MINIMO_POL,
  bunnyStorageHost: envVars.BUNNY_STORAGE_HOST,
  bunnyStorageZonaNinos: envVars.BUNNY_STORAGE_ZONA_NINOS,
  bunnyStorageClaveNinos: envVars.BUNNY_STORAGE_CLAVE_NINOS,
  bunnyStorageZonaJovenes: envVars.BUNNY_STORAGE_ZONA_JOVENES,
  bunnyStorageClaveJovenes: envVars.BUNNY_STORAGE_CLAVE_JOVENES,
  bunnyStorageZonaPadres: envVars.BUNNY_STORAGE_ZONA_PADRES,
  bunnyStorageClavePadres: envVars.BUNNY_STORAGE_CLAVE_PADRES,
  bunnyStreamLibrerias: envVars.BUNNY_STREAM_LIBRERIAS,
  lrsEndpoint: envVars.LRS_ENDPOINT,
  lrsKey: envVars.LRS_KEY,
  lrsSecret: envVars.LRS_SECRET,
  internalApiKey: envVars.INTERNAL_API_KEY,
};
