const {
  GetSecretValueCommand,
  SecretsManagerClient,
} = require('@aws-sdk/client-secrets-manager');

// Lee la clave de la hot wallet del mismo secreto de AWS que usa el backend.
// Las credenciales (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) las toma el SDK del .env
async function leerClaveDeAws() {
  const region = process.env.AWS_REGION || 'us-east-1';
  const nombre = process.env.AWS_SECRET_HOT_WALLET || 'mundodictarianiano/hotwallet';

  const cliente = new SecretsManagerClient({ region });
  const { SecretString } = await cliente.send(
    new GetSecretValueCommand({ SecretId: nombre }),
  );
  if (!SecretString) throw new Error(`El secreto ${nombre} está vacío`);

  let clave = SecretString;
  try {
    clave = JSON.parse(SecretString).privateKey;
  } catch {
    // Texto plano: es la clave directa
  }
  if (!clave) throw new Error(`El secreto ${nombre} no tiene el campo "privateKey"`);

  clave = clave.trim();
  return clave.startsWith('0x') ? clave : `0x${clave}`;
}

module.exports = { leerClaveDeAws };
