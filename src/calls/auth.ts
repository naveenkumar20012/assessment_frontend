import { createAsyncThunk } from "@reduxjs/toolkit";
import { PasswordResetConfirmFormData } from "src/forms/PasswordResetConfirmForm/PasswordResetConfirmForm.types";
import { PasswordResetFormData } from "src/forms/PasswordResetForm/PasswordResetForm.types";
import api from "src/utils/api";
import { handleError } from "src/utils/common";
import {
  DETAILS_URL,
  LOGIN_URL,
  LOGOUT_URL,
  PASSWORD_RESET_CONFIRM_URL,
  PASSWORD_RESET_URL,
  VALIDATE_PASSWORD_RESET_TOKEN_URL,
} from "src/utils/urls";

interface Login {
  email: string;
  password: string;
}

export const login = createAsyncThunk<InitialUserData, Login>(
  "auth/login",
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const axios = api(true);
      const res = await axios.post(LOGIN_URL, data);
      return fulfillWithValue(res.data as InitialUserData);
    } catch (error) {
      handleError(error);
      throw rejectWithValue(JSON.stringify(error));
    }
  }
);

export const getInitialDetails = createAsyncThunk<User, void>(
  "auth/getInitialDetails",
  async () => {
    const axios = api();
    const res = await axios.get(DETAILS_URL);
    return res.data as User;
  }
);

export const getInitialDetailsWithToken = createAsyncThunk<
  InternalLogin,
  string
>(
  "auth/getInitialDetailsWithToken",
  async (token, { rejectWithValue, fulfillWithValue }) => {
    try {
      const axios = api();
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
      const res = await axios.get(DETAILS_URL);
      return fulfillWithValue({
        user: res.data,
        token: token,
      } as InternalLogin);
    } catch (error) {
      handleError(error);
      throw rejectWithValue(JSON.stringify(error));
    }
  }
);

export const logout = createAsyncThunk<void, void>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const axios = api();
      await axios.post(LOGOUT_URL);
    } catch (error) {
      handleError(error);
      throw rejectWithValue(JSON.stringify(error));
    }
  }
);

export const passwordReset = async (formData: PasswordResetFormData) => {
  const axios = api();
  await axios.post(PASSWORD_RESET_URL, formData);
};

export const validatePasswordResetToken = async (token: string) => {
  const axios = api();
  await axios.post(VALIDATE_PASSWORD_RESET_TOKEN_URL, { token });
};

export const passwordResetConfirm = async (
  formData: PasswordResetConfirmFormData
) => {
  const axios = api();
  await axios.post(PASSWORD_RESET_CONFIRM_URL, formData);
};
