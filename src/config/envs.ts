import 'dotenv/config';
import * as joi from 'joi';
interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  AZURE_BLOB_STORAGE_ENDPOINT: string;
  AZURE_STORAGE_ACCOUNT_NAME: string;
  AZURE_STORAGE_ACCOUNT_KEY: string;
  AZURE_BLOB_CONTAINER_NAME: string;
  JWT_SECRET: string;
  BUNNY_LIBRARY_ID: string;
  BUNNY_TOKEN_AUTH_KEY: string;
  BUNNY_CDN_HOSTNAME: string;
  LRS_ENDPOINT: string;
  LRS_KEY: string;
  LRS_SECRET: string;
  AUTH_API_URL: string;
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
    JWT_SECRET: joi.string().required(),
    BUNNY_LIBRARY_ID: joi.string().allow('').default(''),
    BUNNY_TOKEN_AUTH_KEY: joi.string().allow('').default(''),
    BUNNY_CDN_HOSTNAME: joi.string().allow('').default(''),
    LRS_ENDPOINT: joi.string().allow('').default(''),
    LRS_KEY: joi.string().allow('').default(''),
    LRS_SECRET: joi.string().allow('').default(''),
    AUTH_API_URL: joi.string().default('http://localhost:3002'),
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
  jwtSecret: envVars.JWT_SECRET,
  bunnyLibraryId: envVars.BUNNY_LIBRARY_ID,
  bunnyTokenAuthKey: envVars.BUNNY_TOKEN_AUTH_KEY,
  bunnyCdnHostname: envVars.BUNNY_CDN_HOSTNAME,
  lrsEndpoint: envVars.LRS_ENDPOINT,
  lrsKey: envVars.LRS_KEY,
  lrsSecret: envVars.LRS_SECRET,
  authApiUrl: envVars.AUTH_API_URL,
  internalApiKey: envVars.INTERNAL_API_KEY,
};
