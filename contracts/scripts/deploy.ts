import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  console.log("Deploying with account:", deployer.account.address);

  const balance = await publicClient.getBalance({ 
    address: deployer.account.address 
  });
  console.log("Account balance:", balance.toString());

  // 1. Deploy MonarchToken
  const token = await viem.deployContract("MonarchToken", [deployer.account.address]);
  console.log("MonarchToken deployed to:", token.address);

  // 2. Deploy NFT (no constructor arguments)
  const nft = await viem.deployContract("NFT");
  console.log("NFT deployed to:", nft.address);

  // 3. Deploy Marketplace (no constructor arguments)
  const marketplace = await viem.deployContract("Marketplace");
  console.log("Marketplace deployed to:", marketplace.address);

  console.log("\n========== COPY THESE ==========");
  console.log(`MONARCH_TOKEN_ADDRESS=${token.address}`);
  console.log(`NFT_ADDRESS=${nft.address}`);
  console.log(`MARKETPLACE_ADDRESS=${marketplace.address}`);
  console.log("================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
