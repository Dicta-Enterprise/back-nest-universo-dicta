const path = require('path');
require('@nomicfoundation/hardhat-ethers');
require('@nomicfoundation/hardhat-verify');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { BLOCKCHAIN_RPC_URL, HOT_WALLET_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

// Sin HOT_WALLET_PRIVATE_KEY, el script de despliegue lee la clave de AWS Secrets Manager
const cuentas = HOT_WALLET_PRIVATE_KEY ? [HOT_WALLET_PRIVATE_KEY] : [];

// BLOCKCHAIN_RPC_URL tiene que ser de la misma red que se elige con --network:
// si no coincide, Hardhat corta antes de enviar nada
module.exports = {
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'cancun',
    },
  },
  networks: {
    polygon: {
      url: BLOCKCHAIN_RPC_URL || '',
      chainId: 137,
      accounts: cuentas,
    },
    amoy: {
      url: BLOCKCHAIN_RPC_URL || '',
      chainId: 80002,
      accounts: cuentas,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || '',
  },
};
