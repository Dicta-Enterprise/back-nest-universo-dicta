import { ConnectionOptions } from 'bullmq';
import { envs } from './envs';

function opcionesConexion(url: string): ConnectionOptions {
  const { hostname, port, username, password, protocol } = new URL(url);

  return {
    host: hostname,
    port: Number(port) || 6379,
    username: username || undefined,
    password: password ? decodeURIComponent(password) : undefined,
    // rediss:// (con doble s) es la conexión cifrada que exige Upstash
    tls: protocol === 'rediss:' ? {} : undefined,
    // BullMQ lo exige para los workers
    maxRetriesPerRequest: null,
  };
}

// El prefijo separa las colas de cada entorno (cada desarrollador y producción)
export const configuracionColas = {
  connection: opcionesConexion(envs.redisUrl),
  prefix: envs.redisPrefijoCola,
};
