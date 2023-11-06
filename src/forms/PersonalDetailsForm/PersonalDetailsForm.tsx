import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { Divider, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { getPersonalDetails, updatePersonalDetails } from "src/calls/settings";
import Loader from "src/components/Loader/Loader";
import SmallLoader from "src/components/Loader/SmallLoader";
import { FullContainer } from "src/styles";
import { handleError } from "src/utils/common";

import { PersonalDetailsFormData } from "./PersonalDetailsForm.types";

const PersonalDetailsForm = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const form = useForm<PersonalDetailsFormData>({});
  const onSubmit = (formData: PersonalDetailsFormData) => {
    setFormLoading(true);
    updatePersonalDetails(formData)
      .then(() => {
        toast.success("Profile data updated");
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };
  useEffect(() => {
    setInitialDataLoading(true);
    getPersonalDetails()
      .then((res) => {
        form.setValue("first_name", res.first_name_view);
        form.setValue("last_name", res.last_name_view);
        form.setValue("email", res.email_view);
        form.setValue("job_title", res.job_title);
        form.setValue("number", res.number);
        form.setValue("timezone", res.timezone);
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setInitialDataLoading(false);
      });
  }, []);
  if (initialDataLoading) {
    return (
      <FullContainer>
        <Loader />
      </FullContainer>
    );
  }
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
            Personal Details
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </Grid>
        <Grid xs={6}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              First Name
            </Typography>
            <Controller
              name="first_name"
              control={form.control}
              rules={{
                required: "The field is required",
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="first_name"
                  placeholder="First Name"
                  name="first_name"
                  autoComplete="first-name"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(form.formState.errors.first_name)}
                  helperText={form.formState.errors.first_name?.message}
                  size="small"
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={6}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Last Name
            </Typography>
            <Controller
              name="last_name"
              control={form.control}
              rules={{
                required: "The field is required",
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="last_name"
                  placeholder="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(form.formState.errors.last_name)}
                  helperText={form.formState.errors.last_name?.message}
                  size="small"
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Email
            </Typography>
            <Controller
              name="email"
              control={form.control}
              rules={{
                required: "The field is required",
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="email"
                  placeholder="Email"
                  name="email"
                  autoComplete="email"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(form.formState.errors.email)}
                  helperText={form.formState.errors.email?.message}
                  size="small"
                  type="email"
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Job Title
            </Typography>
            <Controller
              name="job_title"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="job_title"
                  placeholder="Job Title"
                  name="job_title"
                  autoComplete="job"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(form.formState.errors.job_title)}
                  helperText={form.formState.errors.job_title?.message}
                  size="small"
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Number
            </Typography>
            <Controller
              name="number"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="number"
                  placeholder="Number"
                  name="number"
                  autoComplete="phone"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(form.formState.errors.number)}
                  helperText={form.formState.errors.number?.message}
                  size="small"
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Timezone
            </Typography>
            <Controller
              name="timezone"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="timezone"
                  placeholder="Timezone"
                  name="timezone"
                  autoComplete="timezone"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(form.formState.errors.timezone)}
                  helperText={form.formState.errors.timezone?.message}
                  size="small"
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

export default PersonalDetailsForm;
