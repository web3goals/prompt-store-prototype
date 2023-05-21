import PromptTablelandEntity from "@/entities/tableland/PromptTablelandEntity";
import { chainToSupportedChainPromptTablelandTable } from "@/utils/chains";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import useError from "./useError";

/**
 * Load prompts from tableland.
 */
export default function usePromptsLoader(): {
  prompts: PromptTablelandEntity[] | undefined;
} {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const [prompts, setPromts] = useState<PromptTablelandEntity[] | undefined>();
  const table = chainToSupportedChainPromptTablelandTable(chain);

  useEffect(() => {
    setPromts(undefined);
    axios
      .get(
        `https://testnets.tableland.network/api/v1/query?statement=select%20%2A%20from%20${table}%20order%20by%20mintingTimestamp%20desc`
      )
      .then((data) => setPromts(data.data))
      .catch((error) => {
        if (error?.response?.data?.message === "Row not found") {
          setPromts([]);
        } else {
          handleError(error, true);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    prompts,
  };
}
