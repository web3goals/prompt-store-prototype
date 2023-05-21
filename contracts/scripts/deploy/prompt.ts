import { ethers } from "hardhat";
import { Prompt__factory } from "../../typechain-types";

async function main() {
  console.log("👟 Start to deploy prompt contract");

  // Define contract deployer
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  // Deploy contract
  const contract = await new Prompt__factory(deployer).deploy();
  await contract.deployed();
  console.log(`✅ Contract deployed to ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
