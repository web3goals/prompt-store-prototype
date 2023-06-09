import { ethers } from "hardhat";
import { Prompt__factory } from "../../typechain-types";

async function main() {
  console.log("👟 Start sandbox");

  // Init accounts
  const accounts = await ethers.getSigners();
  const accountOne = accounts[0];
  const accountTwo = accounts[1];

  // Init contract
  const promptContractAddress = "";
  const promptContract = new Prompt__factory().attach(promptContractAddress);

  // Make transactions
  let tx;

  tx = await promptContract.connect(accountOne)._tableId();
  console.log("_tableId:", tx);

  tx = await promptContract.connect(accountOne).mint("ipfs://4");
  console.log("mint tx hash:", tx.hash);
  await tx.wait();

  tx = await promptContract.connect(accountOne).mint("ipfs://5");
  console.log("mint tx hash:", tx.hash);
  await tx.wait();

  tx = await promptContract.connect(accountOne).mint("ipfs://6");
  console.log("mint tx hash:", tx.hash);
  await tx.wait();

  tx = await promptContract.connect(accountOne).balanceOf(accountOne.address);
  console.log("balanceOf:", tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
