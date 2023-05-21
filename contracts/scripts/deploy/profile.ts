import { ethers } from "hardhat";
import { Profile__factory } from "../../typechain-types/factories/contracts/Profile__factory";

async function main() {
  console.log("👟 Start to deploy profile contract");

  // Define contract deployer
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  // Deploy contract
  const contract = await new Profile__factory(deployer).deploy();
  await contract.deployed();
  console.log(`✅ Contract deployed to ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
