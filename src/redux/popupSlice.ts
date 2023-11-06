import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UpdateAssessmentCreationPopupState {
  isAssessmentCreationPopupOpen: boolean;
  assessmentCreationPopupProps: ConstructedObject;
}
interface UpdateInviteCandidatePopupState {
  isInviteCandidatePopupOpen: boolean;
  inviteCandidatePopupProps: {
    assessmentID: string;
    callback: (count: number) => void;
  };
}

interface UpdateConfirmActionPopupState {
  isConfirmActionPopupOpen: boolean;
  confirmActionPopupProps: {
    pendingQuestions: number;
    onAccept: () => void;
  };
}

interface UpdateScreenWarningPopupState {
  isScreenWarningPopupOpen: boolean;
  screenWarningPopupProps: { count: number; inviteID: string };
}

interface UpdateTabWarningPopupState {
  isTabWarningPopupOpen: boolean;
  tabWarningPopupProps: { count: number; inviteID: string };
}

interface UpdateConfirmPopupState {
  isConfirmPopupOpen: boolean;
  confirmPopupProps: {
    message: string;
    onAccept: () => void;
  };
}

interface PopupState {
  isAssessmentCreationPopupOpen: boolean;
  assessmentCreationPopupProps: ConstructedObject;
  isInviteCandidatePopupOpen: boolean;
  inviteCandidatePopupProps: {
    assessmentID: string;
    callback: (count: number) => void;
  };
  isConfirmActionPopupOpen: boolean;
  confirmActionPopupProps: {
    pendingQuestions: number;
    onAccept: () => void;
  };
  additionCount: number;
  isScreenWarningPopupOpen: boolean;
  screenWarningPopupProps: { count: number; inviteID: string };
  isTabWarningPopupOpen: boolean;
  tabWarningPopupProps: { count: number; inviteID: string };
  isConfirmPopupOpen: boolean;
  confirmPopupProps: {
    message: string;
    onAccept: () => void;
  };
}

const initialState: PopupState = {
  isAssessmentCreationPopupOpen: false,
  assessmentCreationPopupProps: {},
  isInviteCandidatePopupOpen: false,
  inviteCandidatePopupProps: {
    assessmentID: "",
    callback: (count: number) => {},
  },
  isConfirmActionPopupOpen: false,
  confirmActionPopupProps: {
    pendingQuestions: 0,
    onAccept: () => {},
  },
  additionCount: 0,
  isScreenWarningPopupOpen: false,
  screenWarningPopupProps: { count: 0, inviteID: "" },
  isTabWarningPopupOpen: false,
  tabWarningPopupProps: { count: 0, inviteID: "" },
  isConfirmPopupOpen: false,
  confirmPopupProps: { message: "", onAccept: () => {} },
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    updateAssessmentCreationPopupState(
      state,
      action: PayloadAction<UpdateAssessmentCreationPopupState>
    ) {
      state.isAssessmentCreationPopupOpen =
        action.payload.isAssessmentCreationPopupOpen;
      state.assessmentCreationPopupProps =
        action.payload.assessmentCreationPopupProps;
    },
    updateInviteCandiadtePopupState(
      state,
      action: PayloadAction<UpdateInviteCandidatePopupState>
    ) {
      state.isInviteCandidatePopupOpen =
        action.payload.isInviteCandidatePopupOpen;
      state.inviteCandidatePopupProps =
        action.payload.inviteCandidatePopupProps;
    },
    updateConfirmActionPopupState(
      state,
      action: PayloadAction<UpdateConfirmActionPopupState>
    ) {
      state.isConfirmActionPopupOpen = action.payload.isConfirmActionPopupOpen;
      state.confirmActionPopupProps = action.payload.confirmActionPopupProps;
    },
    updateScreenWarningPopupState(
      state,
      action: PayloadAction<UpdateScreenWarningPopupState>
    ) {
      state.isScreenWarningPopupOpen = action.payload.isScreenWarningPopupOpen;
      state.screenWarningPopupProps = action.payload.screenWarningPopupProps;
    },
    updateTabWarningPopupState(
      state,
      action: PayloadAction<UpdateTabWarningPopupState>
    ) {
      state.isTabWarningPopupOpen = action.payload.isTabWarningPopupOpen;
      state.tabWarningPopupProps = action.payload.tabWarningPopupProps;
    },
    updateAdditionCount(state) {
      state.additionCount = state.additionCount + 1;
    },
    updateConfirmPopupState(
      state,
      action: PayloadAction<UpdateConfirmPopupState>
    ) {
      state.isConfirmPopupOpen = action.payload.isConfirmPopupOpen;
      state.confirmPopupProps = action.payload.confirmPopupProps;
    },
  },
});

export const {
  updateAssessmentCreationPopupState,
  updateInviteCandiadtePopupState,
  updateConfirmActionPopupState,
  updateAdditionCount,
  updateScreenWarningPopupState,
  updateTabWarningPopupState,
  updateConfirmPopupState,
} = popupSlice.actions;
export default popupSlice.reducer;
