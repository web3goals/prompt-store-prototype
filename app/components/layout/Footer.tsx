import { palette } from "@/theme/palette";
import { Box, SxProps, Typography } from "@mui/material";
import { Container } from "@mui/system";

/**
 * Component with a footer.
 */
export default function Footer(props: { sx?: SxProps }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: palette.purpleDark,
        ...props.sx,
      }}
    >
      <Copyright />
    </Box>
  );
}

function Copyright(props: { sx?: SxProps }) {
  return (
    <Container maxWidth="md" sx={{ my: 6, ...props.sx }}>
      <Typography
        color="primary.contrastText"
        fontWeight={700}
        textAlign="center"
      >
        Prompt Store © 2023
      </Typography>
      <Typography
        color="primary.contrastText"
        variant="body2"
        textAlign="center"
        mt={0.5}
      >
        🚀 Make AI an assistant for your life and a partner for your business
      </Typography>
    </Container>
  );
}
