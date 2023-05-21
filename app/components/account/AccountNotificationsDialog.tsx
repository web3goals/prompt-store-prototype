import { Dialog, Typography } from "@mui/material";
import { useState } from "react";
import { DialogCenterContent, LargeLoadingButton } from "../styled";

/**
 * Dialog for notifications.
 */
export default function AccountNotificationsDialog(props: {
  isClose?: boolean;
  onClose?: Function;
}) {
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

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogCenterContent>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          🔔 To receive notifications
        </Typography>
        <Typography textAlign="center" mt={1}>
          you should subscribe to the store&apos;s channel
        </Typography>
        <LargeLoadingButton
          href="https://staging.push.org/channels?channel=0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1"
          target="_blank"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Open channel
        </LargeLoadingButton>
      </DialogCenterContent>
    </Dialog>
  );
}
