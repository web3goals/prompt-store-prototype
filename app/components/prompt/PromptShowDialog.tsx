import PromptUriDataEntity from "@/entities/uri/PromptUriDataEntity";
import useError from "@/hooks/useError";
import { palette } from "@/theme/palette";
import {
  chainToSupportedChainLitProtocolChain,
  chainToSupportedChainPromptContractAddress,
} from "@/utils/chains";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { Dialog, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import {
  DialogCenterContent,
  FullWidthSkeleton,
  WidgetBox,
  WidgetText,
  WidgetTitle,
} from "../styled";

const litClient = new LitJsSdk.LitNodeClient([]);

/**
 * Dialog to show a prompt.
 */
export default function PromptShowDialog(props: {
  id: string;
  uriData: PromptUriDataEntity;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const [litNodeClient, setLitNodeClient] = useState<
    LitJsSdk.LitNodeClient | undefined
  >();
  const [prompt, setPrompt] = useState<string | undefined>();

  /**
   * Dialog states
   */
  const [isOpen, setIsOpen] = useState(!props.isClose);

  /**
   * Close dialog
   */
  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  /**
   * Load prompt from lit protocol
   */
  async function loadPromptFromLitProtocol() {
    try {
      if (!litNodeClient) {
        throw new Error("Lit Protocol is not ready");
      }
      const accessControlConditions = [
        {
          contractAddress: chainToSupportedChainPromptContractAddress(chain),
          standardContractType: "ERC721",
          chain: chainToSupportedChainLitProtocolChain(chain) || "",
          method: "balanceOf",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: ">",
            value: "0",
          },
        },
      ];
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: chainToSupportedChainLitProtocolChain(chain) || "",
      });
      const symmetricKey = await litNodeClient.getEncryptionKey({
        accessControlConditions,
        toDecrypt: props.uriData.promptEncryptedSymmetricKey || "",
        chain: chainToSupportedChainLitProtocolChain(chain) || "",
        authSig,
      });
      const decryptedString = await LitJsSdk.decryptString(
        LitJsSdk.base64StringToBlob(props.uriData.promptEncryptedString || ""),
        symmetricKey
      );
      setPrompt(decryptedString);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  /**
   * Init lit node client
   */
  useEffect(() => {
    if (!litNodeClient) {
      litClient
        .connect()
        .then(() => {
          setLitNodeClient(litClient);
        })
        .catch((error) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Load prompt using lit protocol
   */
  useEffect(() => {
    if (litNodeClient && !prompt) {
      loadPromptFromLitProtocol();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [litNodeClient, prompt]);

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="md" fullWidth>
      <DialogCenterContent>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          🤖 Prompt #{props.id}
        </Typography>
        <Typography textAlign="center" mt={1}>
          that can change the world for the better
        </Typography>
        {prompt ? (
          <>
            <WidgetBox bgcolor={palette.greyDark} mt={2}>
              <WidgetTitle>Prompt</WidgetTitle>
              <WidgetText>{prompt}</WidgetText>
            </WidgetBox>
            <WidgetBox bgcolor={palette.greyLight} mt={2}>
              <WidgetTitle>Instruction</WidgetTitle>
              <WidgetText>{props.uriData.instruction}</WidgetText>
            </WidgetBox>
          </>
        ) : (
          <FullWidthSkeleton />
        )}
      </DialogCenterContent>
    </Dialog>
  );
}
