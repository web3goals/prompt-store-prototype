import PromptTablelandEntity from "@/entities/tableland/PromptTablelandEntity";
import usePromptsLoader from "@/hooks/usePromptsLoader";
import { Box, Typography } from "@mui/material";
import EntityList from "../entity/EntityList";
import PromptCard from "../prompt/PromptCard";

/**
 * A component with account prompts.
 */
export default function AccountPrompts(props: { address: string }) {
  const { prompts } = usePromptsLoader({ minter: props.address });

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🤖 Prompts
      </Typography>
      <Typography textAlign="center" mt={1}>
        that was created by the account
      </Typography>
      <EntityList
        entities={prompts}
        renderEntityCard={(prompt: PromptTablelandEntity, index) => (
          <PromptCard key={index} id={prompt.id} uri={prompt.uri} />
        )}
        noEntitiesText="😐 no prompts"
        sx={{ mt: 4 }}
      />
    </Box>
  );
}
