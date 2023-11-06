import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeedbackFormData } from "src/forms/FeedbackForm/FeedbackForm.types";
import { RespondentAssessmentFormData } from "src/pages/RespondentAssessment/RespondentAssessment.types";
import api from "src/utils/api";
import { dataURItoBlob, handleError } from "src/utils/common";
import { ATTEMPT_URL, FEEDBACK_URL, RESPONDENT_URL } from "src/utils/urls";

export const getAssessmentCandidateBasicDetails = createAsyncThunk<
  RespondentBasicDetails,
  string
>(
  "respondent/getAssessmentCandidateBasicDetails",
  async (inviteID, { rejectWithValue, fulfillWithValue }) => {
    try {
      const axios = api();
      const res = await axios.get(`${RESPONDENT_URL}${inviteID}/basic/`);
      return fulfillWithValue(res.data as RespondentBasicDetails);
    } catch (error) {
      handleError(error);
      throw rejectWithValue(JSON.stringify(error));
    }
  }
);

export const startAssessment = async (inviteID: string) => {
  const axios = api();
  await axios.get(`${RESPONDENT_URL}${inviteID}/started/`);
};

export const submitTest = async (
  inviteID: string,
  formData: RespondentAssessmentFormData
) => {
  const axios = api();
  const data = Object.keys(formData)
    .map((question) => ({
      question: question,
      answers: formData[question],
      invite: inviteID,
    }))
    .filter(
      (attempt) =>
        attempt.answers &&
        attempt.answers.length &&
        attempt.answers.every((answer) => answer)
    );
  await axios.post(`${ATTEMPT_URL}?invite=${inviteID}`, data);
};

export const ping = async (inviteID: string) => {
  const axios = api();
  await axios.get(`${RESPONDENT_URL}${inviteID}/last_ping/`);
};

export const tab_switch = async (inviteID: string) => {
  const axios = api();
  await axios.get(`${RESPONDENT_URL}${inviteID}/tab_switches/`);
};

export const fullscreen_exit = async (inviteID: string) => {
  const axios = api();
  await axios.get(`${RESPONDENT_URL}${inviteID}/fullscreen_exists/`);
};

export const submitFeedback = async (formData: FeedbackFormData) => {
  const axios = api();
  await axios.post(FEEDBACK_URL, formData);
};

export const sessionImage = async (inviteID: string, image: string) => {
  const formData = new FormData();
  formData.append(
    "image",
    dataURItoBlob(image),
    `${new Date().toJSON().slice(0, 10)}.jpeg`
  );
  formData.append("invite", inviteID);
  const axios = api();
  await axios.post(`${RESPONDENT_URL}session-images/`, formData);
};
