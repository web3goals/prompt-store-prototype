import ProfileUriDataEntity from "@/entities/uri/ProfileUriDataEntity";
import { Box, SxProps, Typography } from "@mui/material";
import { CardBox } from "../styled";
import AccountAvatar from "./AccountAvatar";
import AccountLink from "./AccountLink";
import AccountReputation from "./AccountReputation";

/**
 * A component with a account card.
 */
export default function AccountCard(props: {
  address: string;
  profileUriData: ProfileUriDataEntity | undefined;
  sales: number;
  sx?: SxProps;
}) {
  return (
    <CardBox sx={{ display: "flex", flexDirection: "row", ...props.sx }}>
      {/* Left part */}
      <Box>
        <AccountAvatar
          account={props.address}
          accountProfileUriData={props.profileUriData}
          size={64}
          emojiSize={28}
        />
      </Box>
      {/* Right part */}
      <Box width={1} ml={1.5} display="flex" flexDirection="column">
        <AccountLink
          account={props.address}
          accountProfileUriData={props.profileUriData}
        />
        {props.profileUriData?.attributes[1].value && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {props.profileUriData?.attributes[1].value}
          </Typography>
        )}
        <AccountReputation sales={props.sales} small sx={{ mt: 1 }} />
      </Box>
    </CardBox>
  );
}
