import { Toaster } from "react-hot-toast";

import Confirm from "src/popups/Confirm/Confirm";
import ConfirmAction from "src/popups/ConfirmAction/ConfirmAction";
import CreateAssessment from "src/popups/CreateAssessment/CreateAssessment";
import InviteCandidate from "src/popups/InviteCandidate/InviteCandidate";
import ScreenWarning from "src/popups/ScreenWarning/ScreenWarning";
import TabWarning from "src/popups/TabWarning/TabWarning";
import { useAppSelector } from "src/redux/hooks";

const Global = () => {
  const {
    isAssessmentCreationPopupOpen,
    assessmentCreationPopupProps,
    isInviteCandidatePopupOpen,
    inviteCandidatePopupProps,
    isConfirmActionPopupOpen,
    confirmActionPopupProps,
    isScreenWarningPopupOpen,
    screenWarningPopupProps,
    isTabWarningPopupOpen,
    tabWarningPopupProps,
    isConfirmPopupOpen,
    confirmPopupProps,
  } = useAppSelector((state) => state.popup);
  return (
    <>
      {isAssessmentCreationPopupOpen && (
        <CreateAssessment {...assessmentCreationPopupProps} />
      )}
      {isInviteCandidatePopupOpen && (
        <InviteCandidate {...inviteCandidatePopupProps} />
      )}
      {isConfirmActionPopupOpen && (
        <ConfirmAction {...confirmActionPopupProps} />
      )}
      {isScreenWarningPopupOpen && (
        <ScreenWarning {...screenWarningPopupProps} />
      )}
      {isTabWarningPopupOpen && <TabWarning {...tabWarningPopupProps} />}
      {isConfirmPopupOpen && <Confirm {...confirmPopupProps} />}
      <Toaster />
    </>
  );
};

export default Global;
