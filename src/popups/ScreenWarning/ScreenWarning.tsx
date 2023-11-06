import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import screenfull from "screenfull";
import { fullscreen_exit } from "src/calls/respondent";
import { updateScreenWarningPopupState } from "src/redux/popupSlice";
import { getCountText } from "src/utils/common";

import { ScreenWarningProps } from "./ScreenWarning.types";

const ScreenWarning: React.FC<ScreenWarningProps> = (props) => {
  const { count, inviteID } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    fullscreen_exit(inviteID || "");
  }, []);
  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Detected exit from full screen
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You have excited full screen {getCountText(count)}, please do not exit
          full screen, if this is detected more than 3 times the assessment is
          auto submitted
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            screenfull.request();
            dispatch(
              updateScreenWarningPopupState({
                isScreenWarningPopupOpen: false,
                screenWarningPopupProps: { count: 0, inviteID: "" },
              })
            );
          }}
          autoFocus
        >
          Go Back To Full Screen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScreenWarning;
