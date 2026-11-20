import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  console.log("Deploying with account:", deployer.account.address);

  const balance = await publicClient.getBalance({ address: deployer.account.address });
  console.log("Account balance:", balance.toString());

  // Deploy NFT
  const nft = await viem.deployContract("NFT");
  console.log("NFT deployed to:", nft.address);

  // Deploy Marketplace
  const marketplace = await viem.deployContract("Marketplace");
  console.log("Marketplace deployed to:", marketplace.address);

  console.log("\n========== COPY THESE ==========");
  console.log(`NFT_ADDRESS=${nft.address}`);
  console.log(`MARKETPLACE_ADDRESS=${marketplace.address}`);
  console.log("================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
