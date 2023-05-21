import { ethers } from "hardhat";
import { Profile__factory } from "../../typechain-types/factories/contracts/Profile__factory";

async function main() {
  console.log("👟 Start to deploy profile contract");

  // Define deployer wallet
  const deployerWallet = new ethers.Wallet(
    process.env.PRIVATE_KEY_1 || "",
    ethers.provider
  );

  // Deploy contract
  const contract = await new Profile__factory(deployerWallet).deploy();
  await contract.deployed();
  console.log(`✅ Contract deployed to ${contract.address}`);
  console.log(
    `⚠️ Do not forget to grant admin role for this contract in the prompt contract`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
