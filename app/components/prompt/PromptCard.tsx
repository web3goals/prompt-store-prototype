import { profileContractAbi } from "@/contracts/abi/profileContract";
import ProfileUriDataEntity from "@/entities/uri/ProfileUriDataEntity";
import PromptUriDataEntity from "@/entities/uri/PromptUriDataEntity";
import useListingLoader from "@/hooks/useListingLoader";
import useUriDataLoader from "@/hooks/useUriDataLoader";
import {
  chainToSupportedChainNativeCurrencySymbol,
  chainToSupportedChainProfileContractAddress,
} from "@/utils/chains";
import {
  stringToAddress,
  timestampToLocaleDateString,
} from "@/utils/converters";
import {
  Box,
  Link as MuiLink,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import Link from "next/link";
import { useContractRead, useNetwork } from "wagmi";
import AccountAvatar from "../account/AccountAvatar";
import AccountLink from "../account/AccountLink";
import { CardBox } from "../styled";

/**
 * A component with a prompt card.
 */
export default function PromptCard(props: {
  id: number;
  uri: string;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();

  /**
   * Define prompt uri data
   */
  const { data: promptUriData } = useUriDataLoader<PromptUriDataEntity>(
    props.uri
  );

  /**
   * Define author data
   */
  const { data: authorProfileUri } = useContractRead({
    address: chainToSupportedChainProfileContractAddress(chain),
    abi: profileContractAbi,
    functionName: "getURI",
    args: [
      stringToAddress(promptUriData?.author) || ethers.constants.AddressZero,
    ],
  });
  const { data: authorProfileUriData } =
    useUriDataLoader<ProfileUriDataEntity>(authorProfileUri);

  /**
   * Define listing
   */
  const { listing: promptListing } = useListingLoader(props.id.toString());

  if (!promptUriData) {
    return <></>;
  }

  return (
    <CardBox sx={{ display: "flex", flexDirection: "row", ...props.sx }}>
      {/* Left part */}
      <Box>
        <AccountAvatar
          account={promptUriData.author || ethers.constants.AddressZero}
          accountProfileUriData={authorProfileUriData}
        />
      </Box>
      {/* Right part */}
      <Box width={1} ml={1.5} display="flex" flexDirection="column">
        <AccountLink
          account={promptUriData.author || ethers.constants.AddressZero}
          accountProfileUriData={authorProfileUriData}
        />
        {/* Title */}
        <Link href={`/prompts/${props.id}`} passHref legacyBehavior>
          <MuiLink fontWeight={700} mt={1}>
            {promptUriData.title}
          </MuiLink>
        </Link>
        {/* Description */}
        <Typography variant="body2" mt={0.5}>
          {promptUriData.description}
        </Typography>
        {/* Details */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 0.5, md: 2 }}
          alignItems={{ md: "center" }}
          mt={2}
        >
          {promptListing && (
            <Typography variant="body2" fontWeight={700} color="orange">
              {promptListing.price}{" "}
              {chainToSupportedChainNativeCurrencySymbol(chain)}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {promptUriData.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {timestampToLocaleDateString(promptUriData.created, true)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Prompt #{props.id}
          </Typography>
        </Stack>
      </Box>
    </CardBox>
  );
}
