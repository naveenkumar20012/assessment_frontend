import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { tab_switch } from "src/calls/respondent";
import { updateTabWarningPopupState } from "src/redux/popupSlice";
import { getCountText } from "src/utils/common";

import { TabWarningProps } from "./TabWarning.types";

const TabWarning: React.FC<TabWarningProps> = (props) => {
  const { count, inviteID } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    tab_switch(inviteID || "");
  }, []);
  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Tab change detected</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You have changed the tab {getCountText(count)}, please do not change
          the tab, if this is detected more than 3 times the assessment is auto
          submitted
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(
              updateTabWarningPopupState({
                isTabWarningPopupOpen: false,
                tabWarningPopupProps: { count: 0, inviteID: "" },
              })
            );
          }}
          autoFocus
        >
          Resume Assessment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TabWarning;
