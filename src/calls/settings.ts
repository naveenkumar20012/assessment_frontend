import { CompanyDetailsFormData } from "src/forms/CompanyDetailsForm/CompanyDetailsForm.types";
import { PasswordChangeFormData } from "src/forms/PasswordChangeForm/PasswordChangeForm.types";
import { PersonalDetailsFormData } from "src/forms/PersonalDetailsForm/PersonalDetailsForm.types";
import api from "src/utils/api";
import {
  COMPANY_UPDATE_URL,
  MEMBER_UPDATE_URL,
  PASSWORD_UPDATE_URL,
} from "src/utils/urls";

export const getPersonalDetails = async () => {
  const axios = api();
  const res = await axios.get(MEMBER_UPDATE_URL);
  return res.data as PersonalDetailsFormData;
};

export const updatePersonalDetails = async (data: PersonalDetailsFormData) => {
  const axios = api();
  await axios.patch(MEMBER_UPDATE_URL, data);
};

export const updatePassword = async (data: PasswordChangeFormData) => {
  const axios = api();
  await axios.patch(PASSWORD_UPDATE_URL, data);
};

export const getCompanyDetails = async () => {
  const axios = api();
  const res = await axios.get(COMPANY_UPDATE_URL);
  return res.data as CompanyDetailsFormData;
};

export const updateCompanyDetails = async (data: CompanyDetailsFormData) => {
  const axios = api();
  await axios.patch(COMPANY_UPDATE_URL, data);
};
