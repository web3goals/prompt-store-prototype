import PromptUriDataEntity from "@/entities/uri/PromptUriDataEntity";
import ProfileUriDataEntity from "entities/uri/ProfileUriDataEntity";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useEffect, useState } from "react";

/**
 * Load uri data from ipfs.
 */
export default function useUriDataLoader<
  T extends ProfileUriDataEntity | PromptUriDataEntity
>(
  uri?: string
): {
  data: T | undefined;
} {
  const { loadJsonFromIpfs } = useIpfs();
  const { handleError } = useError();
  const [data, setData] = useState<T | undefined>();

  useEffect(() => {
    setData(undefined);
    if (uri) {
      loadJsonFromIpfs(uri)
        .then((data) => {
          setData(data);
        })
        .catch((error) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri]);

  return { data };
}
