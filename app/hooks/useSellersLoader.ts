import SellerTablelandEntity from "@/entities/tableland/SellerTablelandEntity";
import { chainToSupportedChainMarketplaceTablelandTable } from "@/utils/chains";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import useError from "./useError";

/**
 * Load sellers from tableland.
 */
export default function useSellersLoader(): {
  sellers: SellerTablelandEntity[] | undefined;
} {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const [sellers, setSellers] = useState<SellerTablelandEntity[] | undefined>();
  const table = chainToSupportedChainMarketplaceTablelandTable(chain);

  useEffect(() => {
    setSellers(undefined);
    axios
      .get(
        `https://testnets.tableland.network/api/v1/query?statement=select%20%2A%20from%20${table}%20order%20by%20sales%20desc`
      )
      .then((data) => setSellers(data.data))
      .catch((error) => {
        if (error?.response?.data?.message === "Row not found") {
          setSellers([]);
        } else {
          handleError(error, true);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sellers,
  };
}
