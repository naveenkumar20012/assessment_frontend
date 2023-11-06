import { Controller, useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { login } from "src/calls/auth";
import SmallLoader from "src/components/Loader/SmallLoader";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { validateEmail } from "src/utils/validators";

import { LoginFormData } from "./LoginForm.types";

const LoginForm: React.FC = () => {
  const form = useForm<LoginFormData>();
  const dispatch = useAppDispatch();
  const { authLoading } = useAppSelector((state) => state.auth);
  const onSubmit = (formData: LoginFormData) => {
    dispatch(login(formData));
  };
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
        Login as a recruiter
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
      <Controller
        name="password"
        control={form.control}
        rules={{
          required: "The field is required",
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            fullWidth
            name="password"
            placeholder="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={value || ""}
            onChange={onChange}
            error={Boolean(form.formState.errors.password)}
            helperText={form.formState.errors.password?.message}
            size="small"
          />
        )}
      />
      <Box width="100%" height="100%" display="flex" justifyContent="flex-end">
        <Link
          href="/auth/password/reset"
          underline="hover"
          color={(t) => t.palette.primary.main}
          fontSize={15}
        >
          Forgot password?
        </Link>
      </Box>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={authLoading}
      >
        {authLoading ? <SmallLoader /> : "Login"}
      </Button>
    </Box>
  );
};

export default LoginForm;
