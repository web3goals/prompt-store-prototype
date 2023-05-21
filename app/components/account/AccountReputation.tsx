import { Box, SxProps, Tooltip, Typography } from "@mui/material";

/**
 * A component with account's reputation.
 */
export default function AccountReputation(props: {
  sales: number;
  small?: boolean;
  sx?: SxProps;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", ...props.sx }}>
      <Tooltip title="Number of sold prompts">
        <Typography
          variant={props.small ? "body2" : "body1"}
          fontWeight={700}
          sx={{ mr: 1.5, cursor: "help" }}
        >
          🤖 {props.sales}
        </Typography>
      </Tooltip>
    </Box>
  );
}
