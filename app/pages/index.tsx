import EntityList from "@/components/entity/EntityList";
import Layout from "@/components/layout";
import PromptCard from "@/components/prompt/PromptCard";
import { LargeLoadingButton } from "@/components/styled";
import PromptTablelandEntity from "@/entities/tableland/PromptTablelandEntity";
import usePromptsLoader from "@/hooks/usePromptsLoader";
import { Box, Container, Stack, SxProps, Typography } from "@mui/material";
import Image from "next/image";

/**
 * Landing page.
 */
export default function Landing() {
  return (
    <Layout maxWidth={false} disableGutters={true}>
      <HeaderSection sx={{ mt: { md: 4 } }} />
      <QuoteSection />
      <PromptsSection sx={{ mt: { xs: 6, md: 12 } }} />
    </Layout>
  );
}

function HeaderSection(props: { sx?: SxProps }) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...props.sx,
      }}
    >
      <Typography variant="h1" textAlign="center">
        🚀 Make AI an <strong>assistant for your life</strong> and a{" "}
        <strong>partner for your business</strong>
      </Typography>
      <Typography
        color="text.secondary"
        textAlign="center"
        mt={2}
        maxWidth={380}
      >
        Web3 marketplace of prompts for GPT, ChatGPT, Bard and other LLM
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={4}>
        <LargeLoadingButton href="/#prompts" variant="contained">
          Find a prompt
        </LargeLoadingButton>
        <LargeLoadingButton href="/prompts/create" variant="outlined">
          Sell a prompt
        </LargeLoadingButton>
      </Stack>
      <Box width={{ xs: "100%", md: "70%" }} mt={{ xs: 4, md: 8 }}>
        <Image
          src="/images/partners.png"
          alt="Partners"
          width="100"
          height="100"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </Box>
    </Container>
  );
}

function QuoteSection(props: { sx?: SxProps }) {
  return (
    <Box
      width={1}
      py={{ xs: 6, md: 8 }}
      sx={{ backgroundColor: "purpleDark", ...props.sx }}
    >
      <Container maxWidth="md" sx={{ color: "white", textAlign: "center" }}>
        <Typography variant="h4">💬</Typography>
        <Typography variant="h4" fontWeight={700} mt={4}>
          “Some people call this artificial intelligence, but the reality is
          this technology will enhance us. So instead of artificial
          intelligence, I think we’ll augment our intelligence“
        </Typography>
        <Typography fontWeight={700} mt={4}>
          — Ginni Rometty
        </Typography>
      </Container>
    </Box>
  );
}

function PromptsSection(props: { sx?: SxProps }) {
  const { prompts } = usePromptsLoader();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...props.sx,
      }}
    >
      <Box
        id="prompts"
        component="a"
        sx={{
          display: "block",
          position: "relative",
          top: "-98px",
          visibility: "hidden",
        }}
      />
      <Typography variant="h4" fontWeight={700} textAlign="center">
        ✨ Prompts
      </Typography>
      <Typography textAlign="center" mt={1}>
        that can change the world for the better
      </Typography>
      <EntityList
        entities={prompts}
        renderEntityCard={(prompt: PromptTablelandEntity, index) => (
          <PromptCard key={index} id={prompt.id} uri={prompt.uri} />
        )}
        noEntitiesText="😐 no prompts"
        sx={{ mt: 4 }}
      />
    </Container>
  );
}
