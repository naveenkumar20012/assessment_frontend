import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Box,
  Button,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { getCompanyDetails, updateCompanyDetails } from "src/calls/settings";
import Loader from "src/components/Loader/Loader";
import SmallLoader from "src/components/Loader/SmallLoader";
import { FullContainer } from "src/styles";
import { handleError } from "src/utils/common";

import { CompanyDetailsFormData } from "./CompanyDetailsForm.types";

const CompanyDetailsForm = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const form = useForm<CompanyDetailsFormData>({});
  const onSubmit = (formData: CompanyDetailsFormData) => {
    setFormLoading(true);
    updateCompanyDetails(formData)
      .then(() => {
        toast.success("Company data updated");
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
    getCompanyDetails()
      .then((res) => {
        form.setValue("name", res.name);
        form.setValue("description", res.description);
        form.setValue("logo", res.logo);
        form.setValue("primary_color", res.primary_color);
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
            Company Details
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Name
            </Typography>
            <Controller
              name="name"
              control={form.control}
              rules={{
                required: "The field is required",
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="name"
                  placeholder="name"
                  name="name"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(form.formState.errors.description)}
                  helperText={form.formState.errors.description?.message}
                  size="small"
                  disabled
                  sx={{ background: (t) => t.palette.grey[100] }}
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Description
            </Typography>
            <Controller
              name="description"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="description"
                  placeholder="Description"
                  name="description"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(form.formState.errors.description)}
                  helperText={form.formState.errors.description?.message}
                  size="small"
                  multiline
                  rows={5}
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Primary Color
            </Typography>
            <Controller
              name="primary_color"
              control={form.control}
              rules={{
                validate: {
                  color: (value) => {
                    const is_valid = /^#[0-9A-F]{6}$/i.test(value);
                    if (value && !is_valid) {
                      return "Invalid value";
                    }
                  },
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="primary_color"
                  placeholder="Primary Color"
                  name="primary_color"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(form.formState.errors.primary_color)}
                  helperText={form.formState.errors.primary_color?.message}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            height: 20,
                            width: 20,
                            borderRadius: 1,
                            background: (t) =>
                              value ? value : t.palette.primary.main,
                            mr: 1,
                          }}
                        ></Box>
                      </InputAdornment>
                    ),
                  }}
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

export default CompanyDetailsForm;
