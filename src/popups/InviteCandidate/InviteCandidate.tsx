import { Box, Button, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import InviteForm from "src/forms/InviteForm/InviteForm";
import { useAppDispatch } from "src/redux/hooks";
import { updateInviteCandiadtePopupState } from "src/redux/popupSlice";
import { CrossIcon } from "src/utils/svgs";

import { InviteCandidateProps } from "./InviteCandidate.types";

const InviteCandidate: React.FC<InviteCandidateProps> = (props) => {
  const { assessmentID, callback } = props;
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(
      updateInviteCandiadtePopupState({
        isInviteCandidatePopupOpen: false,
        inviteCandidatePopupProps: {
          assessmentID: "",
          callback: (count) => {},
        },
      })
    );
  };
  return (
    <Dialog
      open={true}
      closeAfterTransition
      disableAutoFocus
      fullWidth
      scroll="body"
    >
      <Fade in timeout={1000}>
        <Box>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            padding="10px 10px 10px 20px"
          >
            <Grid>
              <Typography>Invite Candiates</Typography>
            </Grid>
            <Grid>
              <Button onClick={onClose} color="inherit">
                <CrossIcon />
              </Button>
            </Grid>
          </Grid>
          <Divider />
          <InviteForm
            assessmentID={assessmentID}
            onClose={onClose}
            callback={callback}
          />
        </Box>
      </Fade>
    </Dialog>
  );
};

export default InviteCandidate;
