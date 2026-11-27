const hre = require('hardhat');
const { leerClaveDeAws } = require('./clave-aws');

// La hot wallet despliega y queda como administradora del contrato.
// Con HOT_WALLET_PRIVATE_KEY la usa; si no, lee la clave de AWS Secrets Manager
async function obtenerWallet() {
  const [cuenta] = await hre.ethers.getSigners();
  if (cuenta) return cuenta;

  console.log('Leyendo la clave de la hot wallet desde AWS Secrets Manager...');
  return new hre.ethers.Wallet(await leerClaveDeAws(), hre.ethers.provider);
}

async function main() {
  const wallet = await obtenerWallet();
  const saldo = await hre.ethers.provider.getBalance(wallet.address);

  console.log(`Red: ${hre.network.name}`);
  console.log(`Wallet: ${wallet.address}`);
  console.log(`Saldo: ${hre.ethers.formatEther(saldo)} POL`);

  const Contrato = await hre.ethers.getContractFactory('MundoDictarianoSBT', wallet);
  const contrato = await Contrato.deploy(wallet.address);
  await contrato.waitForDeployment();

  const direccion = await contrato.getAddress();
  console.log(`Contrato desplegado en: ${direccion}`);
  console.log(`Transacción: ${contrato.deploymentTransaction().hash}`);
  console.log(`Agregar al .env: CONTRACT_ADDRESS=${direccion}`);
  console.log(
    `Para verificarlo: npx hardhat verify --network ${hre.network.name} ${direccion} ${wallet.address}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
