import { Fade, Stack } from "@mui/material";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useAppDispatch } from "src/redux/hooks";
import { updateConfirmActionPopupState } from "src/redux/popupSlice";
import { ConformationIcon, CrossIcon } from "src/utils/svgs";

import { ConfirmActionBox } from "./ConfirmAction.styles";
import { ConfirmActionProps } from "./ConfirmAction.types";

const ConfirmAction: React.FC<ConfirmActionProps> = (props) => {
  const { pendingQuestions, onAccept } = props;
  const dispatch = useAppDispatch();
  const onReject = () => {
    dispatch(
      updateConfirmActionPopupState({
        isConfirmActionPopupOpen: false,
        confirmActionPopupProps: {
          pendingQuestions: 0,
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
        <ConfirmActionBox>
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            padding="10px 25px"
          >
            <Grid>
              <Typography fontWeight={500} fontSize={16}>
                {pendingQuestions
                  ? "Are you sure you want to end the assessment?"
                  : "Confirm assessment submit"}
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
              {pendingQuestions
                ? `You still have ${pendingQuestions} Questions to Answer`
                : "Once closed, you can no longer view or modify this assessment"}
            </Typography>
            <Typography
              fontWeight={500}
              fontSize={16}
              color={(t) => t.palette.grey[500]}
            >
              {pendingQuestions
                ? "Do you still want to end the assessment?"
                : "Are you sure you are done and want to close the assessment?"}
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
              Yes, Submit the assessment
            </Button>
          </Stack>
        </ConfirmActionBox>
      </Fade>
    </Modal>
  );
};

export default ConfirmAction;
