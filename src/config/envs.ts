import 'dotenv/config';
import * as joi from 'joi';
interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  AZURE_BLOB_STORAGE_ENPOINT: string;
  AZURE_STORAGE_ACCOUNT_NAME: string;
  AZURE_STORAGE_ACCOUNT_KEY: string;
  AZURE_BLOB_CONTAINER_NAME: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    AZURE_BLOB_STORAGE_ENPOINT: joi.string().required(),
    AZURE_STORAGE_ACCOUNT_NAME: joi.string().required(),
    AZURE_STORAGE_ACCOUNT_KEY: joi.string().required(),
    AZURE_BLOB_CONTAINER_NAME: joi.string().required(),
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
  azureBlobStorageEndpoint: envVars.AZURE_BLOB_STORAGE_ENPOINT,
  azureStorageAccountName: envVars.AZURE_STORAGE_ACCOUNT_NAME,
  azureStorageAccountKey: envVars.AZURE_STORAGE_ACCOUNT_KEY,
  azureBlobContainerName: envVars.AZURE_BLOB_CONTAINER_NAME,
  
};
