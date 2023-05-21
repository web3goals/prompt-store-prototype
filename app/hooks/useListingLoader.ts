import { markeplaceContractAbi } from "@/contracts/abi/markeplaceContract";
import ListingEntity from "@/entities/ListingEntity";
import {
  chainToSupportedChainMarketplaceContractAddress,
  chainToSupportedChainPromptContractAddress,
} from "@/utils/chains";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContractRead, useNetwork } from "wagmi";
import useError from "./useError";

/**
 * Load listing from marketplace.
 */
export default function useListingLoader(id: string | undefined): {
  listing: ListingEntity | undefined;
} {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const [listing, setListing] = useState<ListingEntity | undefined>();

  /**
   * Contract states to get listing
   */
  const { data: listings } = useContractRead({
    address: chainToSupportedChainMarketplaceContractAddress(chain),
    abi: markeplaceContractAbi,
    functionName: "getListings",
    args: [
      BigInt(id || 0),
      chainToSupportedChainPromptContractAddress(chain) ||
        ethers.constants.AddressZero,
    ],
    enabled: Boolean(id),
    onError(error: any) {
      handleError(error, true);
    },
  });

  /**
   * Check listings to define actual sell price
   */
  useEffect(() => {
    setListing(undefined);
    if (
      listings &&
      listings.length > 0 &&
      listings[listings.length - 1].owner === ethers.constants.AddressZero
    ) {
      setListing({
        price: ethers.utils.formatEther(
          listings[listings.length - 1].listPrice
        ),
        marketplaceId: listings[listings.length - 1].marketplaceId.toString(),
      });
    }
  }, [listings]);

  return { listing };
}
