import { createSlice } from "@reduxjs/toolkit";
import { getAssessmentCandidateBasicDetails } from "src/calls/respondent";

interface RespondentState extends RespondentBasicDetails {
  respondentLoading: boolean;
  isRespontentDataLoaded: boolean;
  inviteNotFound: boolean;
}

const initialState = {
  uuid: "",
  is_started: false,
  is_submitted: false,
  is_revoked: false,
  is_expired: false,
  is_ats: false,
  email: "",
  assessment_name: "",
  assessment_type: "",
  logo: "",
  primary_color: "",
  company_name: "",
  ats_company_name: "",
  questions: 0,
  respondentLoading: true,
  isRespontentDataLoaded: false,
  name: "",
  assessment_duration: 0,
  inviteNotFound: false,
  is_tab_switches_enabled: true,
  is_fullscreen_exits_enabled: true,
  is_shuffling_enabled: true,
  is_proctoring_enabled: true,
} as RespondentState;

const respondentSlice = createSlice({
  name: "respondent",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /* ------------------getAssessmentCandidateBasicDetails---------------------- */
    builder.addCase(getAssessmentCandidateBasicDetails.pending, (state) => {
      state.respondentLoading = true;
    });
    builder.addCase(
      getAssessmentCandidateBasicDetails.fulfilled,
      (state, action) => {
        state.uuid = action.payload.uuid;
        state.is_started = action.payload.is_started;
        state.is_submitted = action.payload.is_submitted;
        state.is_revoked = action.payload.is_revoked;
        state.is_expired = action.payload.is_expired;
        state.email = action.payload.email;
        state.assessment_name = action.payload.assessment_name;
        state.assessment_type = action.payload.assessment_type;
        state.logo = action.payload.logo;
        state.primary_color = action.payload.primary_color;
        state.company_name = action.payload.company_name;
        state.questions = action.payload.questions;
        state.respondentLoading = false;
        state.isRespontentDataLoaded = true;
        state.name = action.payload.name;
        state.assessment_duration = action.payload.assessment_duration;
        state.is_ats = action.payload.is_ats;
        state.ats_company_name = action.payload.ats_company_name;
        state.is_tab_switches_enabled = action.payload.is_tab_switches_enabled;
        state.is_fullscreen_exits_enabled =
          action.payload.is_fullscreen_exits_enabled;
        state.is_shuffling_enabled = action.payload.is_shuffling_enabled;
        state.is_proctoring_enabled = action.payload.is_proctoring_enabled;
        state.restricted_languages = action.payload.restricted_languages;
      }
    );
    builder.addCase(getAssessmentCandidateBasicDetails.rejected, (state) => {
      console.error("Could not load respondent data");
      state.inviteNotFound = true;
      state.respondentLoading = false;
    });
  },
});

export default respondentSlice.reducer;
