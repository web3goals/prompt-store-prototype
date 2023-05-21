import { ethers } from "hardhat";
import { Marketplace__factory, Prompt__factory } from "../../typechain-types";

async function main() {
  console.log("👟 Start sandbox");

  // Init accounts
  const accounts = await ethers.getSigners();
  const accountOne = accounts[0];
  const accountTwo = accounts[1];

  // Init contracts
  const promptContractAddress = "";
  const marketplaceContractAddress = "";
  const promptContract = new Prompt__factory().attach(promptContractAddress);
  const marketplaceContract = new Marketplace__factory().attach(
    marketplaceContractAddress
  );

  // Define params
  const marketplaceId = 1;
  const tokenId = 1;

  // Make transactions
  let tx;

  tx = await marketplaceContract.connect(accountOne)._tableId();
  console.log("_tableId:", tx);

  tx = await promptContract
    .connect(accountOne)
    .approve(marketplaceContract.address, tokenId);
  console.log("approve tx hash:", tx.hash);
  await tx.wait();

  tx = await marketplaceContract
    .connect(accountOne)
    .createListing(
      tokenId,
      promptContract.address,
      ethers.utils.parseEther("0.01")
    );
  console.log("createListing tx hash:", tx.hash);
  await tx.wait();

  tx = await marketplaceContract
    .connect(accountTwo)
    .buyListing(marketplaceId, promptContract.address, {
      value: ethers.utils.parseEther("0.01"),
    });
  console.log("buyListing tx hash:", tx.hash);
  await tx.wait();

  tx = await promptContract.connect(accountOne).ownerOf(tokenId);
  console.log("ownerOf:", tx);

  tx = await marketplaceContract
    .connect(accountOne)
    .getListings(tokenId, promptContract.address);
  console.log("getListings:", tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
