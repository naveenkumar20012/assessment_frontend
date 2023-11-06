import { InviteFormData } from "src/forms/InviteForm/InviteForm.types";
import {
  NonTechnicalAssessmentsFormData,
  QuestionFormData,
} from "src/forms/NonTechnicalAssessmentsForm/NonTechnicalAssessmentsForm.types";
import { TechnicalAssessmentFormData } from "src/forms/TechnicalAssessmentForm/TechnicalAssessmentForm.types";
import api from "src/utils/api";
import { splitAtFirstOccurrence } from "src/utils/common";
import { ASSESSMENTS_URL, EXECUTION_URL, INVITE_URL } from "src/utils/urls";

interface CodeDetails {
  inviteID: string;
  language: number;
  code: string;
}

interface BasicQuestion {
  uuid: string;
  body: string;
}

interface EditQuestion {
  existing_question: string;
  new_question: string;
  new_question_difficulty: string;
}

export const createTechnicalAssessment = async (
  formData: TechnicalAssessmentFormData
) => {
  const axios = api();
  const res = await axios.post(`${ASSESSMENTS_URL}technical/`, {
    ...formData,
    skills: Object.keys(formData.config),
  });
  return res.data as { uuid: string };
};

export const createNonTechnicalAssessment = async (
  formData: NonTechnicalAssessmentsFormData
) => {
  const axios = api();
  const res = await axios.post(`${ASSESSMENTS_URL}non_technical/`, {
    ...formData,
    skills: formData.skills.map((skill) => skill.name),
  });
  return res.data as {
    base_question: string;
    uuid: string;
    questions: BasicQuestion[];
  };
};

export const inviteCandidates = async (formData: InviteFormData) => {
  const axios = api();
  const candidates = formData.candidates ?? [];
  const bulkCandidates = formData.bulkCandidates?.split("\n") ?? [];
  const data = candidates
    .map((candidate) => {
      const email = candidate.email;
      const name = candidate.name;
      return {
        email: email,
        name: name,
        assessment: formData.assessment,
        expiry: formData.expiry,
      };
    })
    .filter((entry) => entry.email);
  const bulkData = bulkCandidates
    .map((entry) => {
      const info = splitAtFirstOccurrence(entry, " ");
      const email = info[0];
      const name = info[1] || "";
      return {
        email: email,
        name: name,
        assessment: formData.assessment,
        expiry: formData.expiry,
      };
    })
    .filter((entry) => entry.email);
  await axios.post(INVITE_URL, [...data, ...bulkData]);
};

export const executeCode = async (codeDetails: CodeDetails) => {
  const axios = api();
  const res = await axios.post(EXECUTION_URL, {
    identifier: codeDetails.inviteID,
    code: btoa(codeDetails.code),
    language: codeDetails.language,
  });
  return res.data.uuid as string;
};

export const getExecutionResults = async (uuid: string) => {
  const axios = api();
  const res = await axios.get(`${EXECUTION_URL}${uuid}/`);
  return res.data as ExecutionResult;
};

export const regenerateNonTechnicalAssessment = async (uuid: string) => {
  const axios = api();
  const res = await axios.get(`${ASSESSMENTS_URL}${uuid}/regenerate/`);
  return res.data as {
    base_question: string;
    uuid: string;
    questions: BasicQuestion[];
  };
};

export const updateNonTechnicalAssessment = async (
  uuid: string,
  formData: QuestionFormData
) => {
  const axios = api();
  const res = await axios.patch(`${ASSESSMENTS_URL}${uuid}/`, formData);
  return res.data as { uuid: string };
};

export const revokeInvite = async (uuid: string) => {
  const axios = api();
  await axios.post(`${INVITE_URL}${uuid}/revoke/`);
};

export const downoadReport = async (uuid: string) => {
  const axios = api();
  const response = await axios.get(`${INVITE_URL}${uuid}/report/`, {
    responseType: "blob",
  });
  // create file link in browser's memory
  const href = URL.createObjectURL(response.data);
  // create "a" HTML element with href to file & click
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", `${uuid}.pdf`); //or any other extension
  document.body.appendChild(link);
  link.click();
  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

export const downoadSessionImages = async (uuid: string) => {
  const axios = api();
  const response = await axios.get(`${INVITE_URL}${uuid}/session_images/`, {
    responseType: "blob",
  });
  // create file link in browser's memory
  const href = URL.createObjectURL(response.data);
  // create "a" HTML element with href to file & click
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", `${uuid}.zip`); //or any other extension
  document.body.appendChild(link);
  link.click();
  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

export const regenerateQuestion = async (
  assessmentID: string,
  questionID: string
) => {
  const axios = api();
  const res = await axios.post(
    `${ASSESSMENTS_URL}${assessmentID}/regenerate_question/`,
    {
      question: questionID,
    }
  );
  return res.data as Question;
};

export const editQuestion = async (
  assessmentID: string,
  data: EditQuestion
) => {
  const axios = api();
  const res = await axios.post(
    `${ASSESSMENTS_URL}${assessmentID}/edit_question/`,
    data
  );
  return res.data as Question;
};

export const assessmentReport = async (assessmentID: string) => {
  const axios = api();
  const response = await axios.get(
    `${ASSESSMENTS_URL}${assessmentID}/report/`,
    {
      responseType: "blob",
    }
  );
  // create file link in browser's memory
  const href = URL.createObjectURL(response.data);
  // create "a" HTML element with href to file & click
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", `${assessmentID}.csv`); //or any other extension
  document.body.appendChild(link);
  link.click();
  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
