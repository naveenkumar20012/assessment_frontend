import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { updatePassword } from "src/calls/settings";
import SmallLoader from "src/components/Loader/SmallLoader";
import { handleError } from "src/utils/common";

import { PasswordChangeFormData } from "./PasswordChangeForm.types";

const PasswordChangeForm = () => {
  const [formLoading, setFormLoading] = useState(false);
  const form = useForm<PasswordChangeFormData>({});
  const onSubmit = (formData: PasswordChangeFormData) => {
    setFormLoading(true);
    updatePassword(formData)
      .then(() => {
        toast.success("Password updated");
        form.reset();
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };
  return (
    <Box
      component="form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      padding="20px"
    >
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Typography fontWeight={500} fontSize={18}>
            Change Password
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Old Password
            </Typography>
            <Controller
              name="old_password"
              control={form.control}
              rules={{
                required: "The field is required",
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="old_password"
                  placeholder="Old Password"
                  name="old_password"
                  autoComplete="password"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(form.formState.errors.old_password)}
                  helperText={form.formState.errors.old_password?.message}
                  size="small"
                  type="password"
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              New Password
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
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Confirm new password
            </Typography>
            <Controller
              name="password2"
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
                  id="new-password"
                  placeholder="Confirm new password"
                  name="password2"
                  autoComplete="new-password"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(form.formState.errors.password2)}
                  helperText={form.formState.errors.password2?.message}
                  size="small"
                  type="password"
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={formLoading}
          >
            {formLoading ? <SmallLoader /> : "Update"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PasswordChangeForm;
