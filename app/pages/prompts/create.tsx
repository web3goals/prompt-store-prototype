import FormikHelper from "@/components/helper/FormikHelper";
import Layout from "@/components/layout";
import {
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputSelect,
  WidgetInputTextField,
  WidgetTitle,
} from "@/components/styled";
import { promptContractAbi } from "@/contracts/abi/promptContract";
import PromptUriDataEntity from "@/entities/uri/PromptUriDataEntity";
import useError from "@/hooks/useError";
import useIpfs from "@/hooks/useIpfs";
import useToasts from "@/hooks/useToast";
import { palette } from "@/theme/palette";
import {
  chainToSupportedChainId,
  chainToSupportedChainPromptContractAddress,
} from "@/utils/chains";
import { MenuItem, Typography } from "@mui/material";
import { ethers } from "ethers";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import * as yup from "yup";

/**
 * Page to create a prompt.
 */
export default function CreatePrompt() {
  const router = useRouter();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { handleError } = useError();
  const { uploadJsonToIpfs } = useIpfs();
  const { showToastSuccess, showToastError } = useToasts();

  /**
   * Form states
   */
  const [formValues, setFormValues] = useState({
    category: "🪄 Assistant",
    title: "Forming an order for food delivery",
    description: "Prompt that helps to form an order",
    prompt: "",
    instruction: "",
  });
  const formValidationSchema = yup.object({
    category: yup.string().required(),
    title: yup.string().required(),
    description: yup.string().required(),
    prompt: yup.string().required(),
    instruction: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [submittedFormDataUri, setSubmittedFormDataUri] = useState("");

  /**
   * Contract states
   */
  const { config: contractPrepareConfig } = usePrepareContractWrite({
    address: chainToSupportedChainPromptContractAddress(chain),
    abi: promptContractAbi,
    functionName: "mint",
    args: [submittedFormDataUri],
    chainId: chainToSupportedChainId(chain),
    onError(error: any) {
      showToastError(error);
    },
  });
  const {
    data: contractWriteData,
    isLoading: isContractWriteLoading,
    write: contractWrite,
  } = useContractWrite(contractPrepareConfig);
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({
      hash: contractWriteData?.hash,
    });

  /**
   * Upload form to ipfs
   */
  async function submitForm(values: any) {
    try {
      setIsFormSubmitting(true);
      const formData: PromptUriDataEntity = {
        author: address,
        created: new Date().getTime(),
        category: values.category,
        title: values.title,
        description: values.description,
        prompt: values.prompt,
        instruction: values.instruction,
      };
      // Upload updated profile data to ipfs
      const { uri } = await uploadJsonToIpfs(formData);
      setSubmittedFormDataUri(uri);
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  /**
   * Write data to contract if form was submitted
   */
  useEffect(() => {
    if (submittedFormDataUri && contractWrite && !isContractWriteLoading) {
      contractWrite?.();
      setSubmittedFormDataUri("");
    }
  }, [submittedFormDataUri, contractWrite, isContractWriteLoading]);

  /**
   * Listen contract events to open page of created prompt.
   *
   * TODO: Don't listen transfer event, redirect to prompt list?
   */
  useContractEvent({
    address: chainToSupportedChainPromptContractAddress(chain),
    abi: promptContractAbi,
    eventName: "Transfer",
    listener(log) {
      if (
        log[0].args.from === ethers.constants.AddressZero &&
        log[0].args.to === address
      ) {
        showToastSuccess("Prompt is created!");
        setIsFormSubmitting(false);
        router.push(`/prompts/${log[0].args.tokenId.toString()}`);
      }
    },
  });

  /**
   * Form states
   */
  const isFormLoading =
    isFormSubmitting ||
    Boolean(submittedFormDataUri) ||
    isContractWriteLoading ||
    isTransactionLoading;
  const isFormDisabled = isFormLoading || isTransactionSuccess;
  const isFormSubmittingDisabled = isFormDisabled || !contractWrite;

  return (
    <Layout maxWidth="sm">
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🚀 Create a prompt
      </Typography>
      <Typography textAlign="center" mt={1}>
        after that you can put it up for sale
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={submitForm}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormikHelper onChange={(values: any) => setFormValues(values)} />
            {/* Category input */}
            <WidgetBox bgcolor={palette.green} mt={2}>
              <WidgetTitle>Category</WidgetTitle>
              <WidgetInputSelect
                id="category"
                name="category"
                placeholder=""
                value={values.category}
                onChange={handleChange}
                disabled={isFormDisabled}
                sx={{ width: 1 }}
              >
                <MenuItem value="🪄 Assistant">🪄 Assistant</MenuItem>
                <MenuItem value="😀 Fun">😀 Fun</MenuItem>
                <MenuItem value="❤️ Health">❤️ Health</MenuItem>
                <MenuItem value="💡 Ideas">💡 Ideas</MenuItem>
                <MenuItem value="🔮 Other">🔮 Other</MenuItem>
              </WidgetInputSelect>
            </WidgetBox>
            {/* Title input */}
            <WidgetBox bgcolor={palette.purpleDark} mt={2}>
              <WidgetTitle>Title</WidgetTitle>
              <WidgetInputTextField
                id="title"
                name="title"
                placeholder=""
                value={values.title}
                onChange={handleChange}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                disabled={isFormDisabled}
                multiline
                maxRows={4}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Description input */}
            <WidgetBox bgcolor={palette.purpleLight} mt={2}>
              <WidgetTitle>Description</WidgetTitle>
              <WidgetInputTextField
                id="description"
                name="description"
                placeholder=""
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                disabled={isFormDisabled}
                multiline
                maxRows={8}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Prompt input */}
            <WidgetBox bgcolor={palette.greyDark} mt={2}>
              <WidgetTitle>Prompt</WidgetTitle>
              <WidgetInputTextField
                id="prompt"
                name="prompt"
                placeholder=""
                value={values.prompt}
                onChange={handleChange}
                error={touched.prompt && Boolean(errors.prompt)}
                helperText={touched.prompt && errors.prompt}
                disabled={isFormDisabled}
                multiline
                maxRows={8}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Instruction input */}
            <WidgetBox bgcolor={palette.greyLight} mt={2}>
              <WidgetTitle>Instruction</WidgetTitle>
              <WidgetInputTextField
                id="instruction"
                name="instruction"
                placeholder=""
                value={values.instruction}
                onChange={handleChange}
                error={touched.instruction && Boolean(errors.instruction)}
                helperText={touched.instruction && errors.instruction}
                disabled={isFormDisabled}
                multiline
                maxRows={8}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Submit button */}
            <ExtraLargeLoadingButton
              loading={isFormLoading}
              variant="outlined"
              type="submit"
              disabled={isFormSubmittingDisabled}
              sx={{ mt: 2 }}
            >
              Submit
            </ExtraLargeLoadingButton>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
