import { Fade, Stack } from "@mui/material";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useAppDispatch } from "src/redux/hooks";
import { updateConfirmPopupState } from "src/redux/popupSlice";
import { ConformationIcon, CrossIcon } from "src/utils/svgs";

import { ConfirmBox } from "./Confirm.styles";
import { ConfirmProps } from "./Confirm.types";

const ConfirmAction: React.FC<ConfirmProps> = (props) => {
  const { onAccept, message } = props;
  const dispatch = useAppDispatch();
  const onReject = () => {
    dispatch(
      updateConfirmPopupState({
        isConfirmPopupOpen: false,
        confirmPopupProps: {
          message: "",
          onAccept: () => {},
        },
      })
    );
  };
  const onAcceptAction = () => {
    onReject();
    onAccept();
  };
  return (
    <Modal open={true} closeAfterTransition disableAutoFocus>
      <Fade in timeout={1000}>
        <ConfirmBox>
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            padding="10px 25px"
          >
            <Grid>
              <Typography fontWeight={500} fontSize={16}>
                Are you sure?
              </Typography>
            </Grid>
            <Grid>
              <Button onClick={onReject} color="inherit">
                <CrossIcon />
              </Button>
            </Grid>
          </Stack>
          <Divider />
          <Stack
            justifyItems="center"
            alignItems="center"
            spacing={1}
            padding="20px 0"
          >
            <ConformationIcon />
            <Typography fontWeight={500} fontSize={16}>
              {message}
            </Typography>
          </Stack>
          <Divider />
          <Stack
            flexDirection="row"
            gap={2}
            justifyContent="space-between"
            padding="15px 25px"
          >
            <Button onClick={onReject} variant="outlined">
              No, go back
            </Button>
            <Button
              onClick={onAcceptAction}
              autoFocus
              variant="contained"
              color="error"
            >
              Yes, continue
            </Button>
          </Stack>
        </ConfirmBox>
      </Fade>
    </Modal>
  );
};

export default ConfirmAction;
