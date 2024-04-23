import * as React from "react";
import { PrimaryButton, Stack } from "@fluentui/react";

type HRButtonsProps = {
  onApprove: () => void;
  onReject: () => void;
};

export function HRButtons(props: HRButtonsProps): JSX.Element {
  const { onApprove, onReject } = props;
  return (
    <Stack tokens={{ childrenGap: 10 }} horizontal>
      <PrimaryButton text="Aprovar" type="submit" onClick={onApprove} />
      <PrimaryButton text="Reprovar" type="submit" onClick={onReject} />
    </Stack>
  );
}
