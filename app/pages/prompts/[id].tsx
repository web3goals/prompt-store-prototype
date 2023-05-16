import AccountAvatar from "@/components/account/AccountAvatar";
import AccountLink from "@/components/account/AccountLink";
import FormikHelper from "@/components/helper/FormikHelper";
import {
  CardBox,
  FullWidthSkeleton,
  LargeLoadingButton,
  ThickDivider,
  WidgetBox,
  WidgetContentBox,
  WidgetInputTextField,
  WidgetText,
  WidgetTitle,
} from "@/components/styled";
import PromptUriDataEntity from "@/entities/uri/PromptUriDataEntity";
import useError from "@/hooks/useError";
import useInfura from "@/hooks/useInfura";
import { palette } from "@/theme/palette";
import {
  chainToSupportedChainId,
  chainToSupportedChainPromptContractAddress,
} from "@/utils/chains";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import axios from "axios";
import Layout from "components/layout";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { timestampToLocaleDateString } from "utils/converters";
import { useNetwork } from "wagmi";
import * as yup from "yup";

/**
 * Page with a prompt.
 */
export default function Prompt() {
  const router = useRouter();
  const { id } = router.query;
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { getTokenData } = useInfura();
  const [promptData, setPromptData] = useState<
    | { owner: string | undefined; uriData: PromptUriDataEntity | undefined }
    | undefined
  >();

  /**
   * Load prompt data
   */
  useEffect(() => {
    if (id) {
      getTokenData(
        chainToSupportedChainId(chain)!,
        chainToSupportedChainPromptContractAddress(chain)!,
        id.toString()
      )
        .then((data) =>
          setPromptData({ owner: data.owner, uriData: data.metadata })
        )
        .catch((error) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Layout maxWidth="sm">
      {id && promptData ? (
        promptData.owner && promptData.uriData ? (
          <>
            <PromptData
              id={id.toString()}
              owner={promptData.owner}
              uriData={promptData.uriData}
            />
            <ThickDivider sx={{ mt: 8, mb: 8 }} />
            <PromptSandbox uriData={promptData.uriData} />
          </>
        ) : (
          <>
            <Typography variant="h4" fontWeight={700} textAlign="center">
              🤔 Hmm...
            </Typography>
            <Typography textAlign="center" mt={1}>
              It seems that the prompt data is not ready now, try to open it
              later
            </Typography>
          </>
        )
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}

function PromptData(props: {
  id: string;
  owner: string;
  uriData: PromptUriDataEntity;
}) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🤖 Prompt #{props.id}
      </Typography>
      <Typography textAlign="center" mt={1}>
        that can change the world for the better
      </Typography>
      {/* Owner */}
      <WidgetBox bgcolor={palette.greyDark} mt={2}>
        <WidgetTitle>Owner</WidgetTitle>
        <WidgetContentBox
          display="flex"
          flexDirection="column"
          alignItems={{ xs: "center", md: "flex-start" }}
        >
          <AccountAvatar
            account={props.owner}
            accountProfileUriData={undefined} // TODO: Load profile uri data
          />
          <AccountLink
            account={props.owner}
            accountProfileUriData={undefined} // TODO: Load profile uri data
            sx={{ mt: 1 }}
          />
        </WidgetContentBox>
      </WidgetBox>
      {/* Created */}
      <WidgetBox bgcolor={palette.greyLight} mt={2}>
        <WidgetTitle>Created</WidgetTitle>
        <WidgetText>
          {timestampToLocaleDateString(props.uriData.created)}
        </WidgetText>
      </WidgetBox>
      {/* Category */}
      <WidgetBox bgcolor={palette.green} mt={2}>
        <WidgetTitle>Category</WidgetTitle>
        <WidgetText>{props.uriData.category}</WidgetText>
      </WidgetBox>
      {/* Title */}
      <WidgetBox bgcolor={palette.purpleDark} mt={2}>
        <WidgetTitle>Title</WidgetTitle>
        <WidgetText>{props.uriData.title}</WidgetText>
      </WidgetBox>
      {/* Description */}
      <WidgetBox bgcolor={palette.purpleLight} mt={2}>
        <WidgetTitle>Description</WidgetTitle>
        <WidgetText>{props.uriData.description}</WidgetText>
      </WidgetBox>
      {/* Price */}
      {/* TODO: Display price prompt is for sale */}
      {/* Buttons */}
      {/* TODO: Display buttons */}
    </Box>
  );
}

function PromptSandbox(props: { uriData: PromptUriDataEntity }) {
  interface Message {
    role: "system" | "assistant" | "user";
    content: string;
  }

  const { handleError } = useError();
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: props.uriData.prompt || "" },
  ]);

  /**
   * Form states
   */
  const [formValues, setFormValues] = useState({
    message: "",
  });
  const formValidationSchema = yup.object({
    message: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  /**
   * Send message to chat gpt and get response.
   */
  async function submitForm(values: any, actions: any) {
    try {
      setIsFormSubmitting(true);
      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [...messages, { role: "user", content: values.message }],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + process.env.NEXT_PUBLIC_OPEN_AI_API_KEY_SECRET,
          },
        }
      );
      setMessages([
        ...messages,
        { role: "user", content: values.message },
        data.choices?.[0]?.message,
      ]);
      actions?.resetForm();
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🕹️ Sandbox
      </Typography>
      <Typography textAlign="center" mt={1}>
        to try the prompt to check out how great it is
      </Typography>
      {/* Form */}
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={submitForm}
      >
        {({ values, errors, touched, handleChange, setValues }) => (
          <Form
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormikHelper onChange={(values: any) => setFormValues(values)} />
            {/* Message input */}
            <WidgetBox bgcolor={palette.yellow} mt={2}>
              <WidgetTitle>Message</WidgetTitle>
              <WidgetInputTextField
                id="message"
                name="message"
                placeholder="How can you help me?"
                value={values.message}
                onChange={handleChange}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                disabled={isFormSubmitting}
                multiline
                maxRows={4}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Submit button */}
            <LargeLoadingButton
              loading={isFormSubmitting}
              variant="outlined"
              type="submit"
              disabled={isFormSubmitting}
              sx={{ mt: 2 }}
            >
              Submit
            </LargeLoadingButton>
          </Form>
        )}
      </Formik>
      {/* Messages */}
      <Box width={1} mt={2}>
        {messages
          .slice(0)
          .reverse()
          .map((message, index) => {
            if (message.role === "system") {
              return <Box key={index} />;
            }
            return (
              <CardBox key={index} sx={{ mt: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    sx={{
                      background:
                        message.role === "assistant"
                          ? palette.blue
                          : palette.yellow,
                    }}
                  >
                    <Typography fontSize={18}>
                      {message.role === "assistant" ? "🤖" : "👤"}
                    </Typography>
                  </Avatar>
                  <Typography>{message.content}</Typography>
                </Stack>
              </CardBox>
            );
          })}
      </Box>
    </Box>
  );
}
