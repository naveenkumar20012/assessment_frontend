import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { passwordReset } from "src/calls/auth";
import SmallLoader from "src/components/Loader/SmallLoader";
import { handleError } from "src/utils/common";
import { validateEmail } from "src/utils/validators";

import { PasswordResetFormData } from "./PasswordResetForm.types";

const PasswordResetForm: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const form = useForm<PasswordResetFormData>();
  const onSubmit = (formData: PasswordResetFormData) => {
    setFormLoading(true);
    passwordReset(formData)
      .then(() => {
        setEmailSent(true);
        toast.success("Reset email sent");
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };
  if (emailSent) {
    return (
      <Typography fontSize={15}>
        Please check your inbox. An email with the reset link has been sent to{" "}
        {form.getValues("email")}
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
        name="email"
        control={form.control}
        rules={{
          required: "The field is required",
          validate: {
            email: (value) => {
              if (!validateEmail(value)) {
                return "Invalid email";
              }
            },
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            fullWidth
            id="email"
            placeholder="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={value || ""}
            onChange={onChange}
            error={Boolean(form.formState.errors.email)}
            helperText={form.formState.errors.email?.message}
            size="small"
          />
        )}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={formLoading}
      >
        {formLoading ? <SmallLoader /> : "Send Password Reset Link"}
      </Button>
    </Box>
  );
};

export default PasswordResetForm;
