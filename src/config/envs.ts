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
  bunnyStreamLibrerias: envVars.BUNNY_STREAM_LIBRERIAS,
  lrsEndpoint: envVars.LRS_ENDPOINT,
  lrsKey: envVars.LRS_KEY,
  lrsSecret: envVars.LRS_SECRET,
  internalApiKey: envVars.INTERNAL_API_KEY,
};
