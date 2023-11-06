import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  passwordResetConfirm,
  validatePasswordResetToken,
} from "src/calls/auth";
import Loader from "src/components/Loader/Loader";
import SmallLoader from "src/components/Loader/SmallLoader";
import { handleError } from "src/utils/common";

import { PasswordResetConfirmFormData } from "./PasswordResetConfirmForm.types";

const PasswordResetConfirmForm: React.FC = () => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [checkingTokenValidity, setCheckingTokenValidity] = useState(true);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const form = useForm<PasswordResetConfirmFormData>();
  useEffect(() => {
    validatePasswordResetToken(token || "")
      .then(() => {
        setIsTokenValid(true);
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setCheckingTokenValidity(false);
      });
  }, []);
  const onSubmit = (formData: PasswordResetConfirmFormData) => {
    setFormLoading(true);
    passwordResetConfirm({ ...formData, token: token || "" })
      .then(() => {
        navigate("/auth/login");
        toast.success("Password changed successfully");
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };
  if (checkingTokenValidity) {
    return <Loader />;
  }
  if (!isTokenValid) {
    return (
      <Typography fontSize={15} textAlign="center">
        This link is no longer valid
      </Typography>
    );
  }
  return (
    <Box
      component="form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap={2.5}
    >
      <Typography fontSize={18} fontWeight={500}>
        Reset password
      </Typography>
      <Controller
        name="password"
        control={form.control}
        rules={{
          required: "The field is required",
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            fullWidth
            id="new-password"
            placeholder="New password"
            name="password"
            autoFocus
            autoComplete="new-password"
            value={value || ""}
            onChange={onChange}
            error={Boolean(form.formState.errors.password)}
            helperText={form.formState.errors.password?.message}
            size="small"
            type="password"
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={form.control}
        rules={{
          required: "The field is required",
          validate: (val: string) => {
            if (form.watch("password") != val) {
              return "Your passwords do not match";
            }
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            fullWidth
            id="confirm-new-password"
            placeholder="Confirm new password"
            name="confirm-new-password"
            value={value || ""}
            onChange={onChange}
            error={Boolean(form.formState.errors.confirmPassword)}
            helperText={form.formState.errors.confirmPassword?.message}
            size="small"
            type="password"
          />
        )}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={formLoading}
      >
        {formLoading ? <SmallLoader /> : "Reset password"}
      </Button>
    </Box>
  );
};

export default PasswordResetConfirmForm;
