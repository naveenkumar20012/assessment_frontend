import { useLocation } from "react-router-dom";

import { Stack, Typography } from "@mui/material";
import { FullContainer } from "src/styles";
import { WarningIcon } from "src/utils/svgs";

const InviteInvalid = () => {
  const { state } = useLocation();
  return (
    <FullContainer>
      <Stack direction="column" spacing={3} alignItems="center">
        <WarningIcon />
        <Typography fontWeight={500}>{state?.message}</Typography>
      </Stack>
    </FullContainer>
  );
};

export default InviteInvalid;
