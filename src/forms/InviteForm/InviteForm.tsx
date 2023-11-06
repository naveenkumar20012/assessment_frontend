import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { IconButton, Stack, Switch, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { inviteCandidates } from "src/calls/assessments";
import Loader from "src/components/Loader/Loader";
import SmallLoader from "src/components/Loader/SmallLoader";
import { useAppDispatch } from "src/redux/hooks";
import { updateAdditionCount } from "src/redux/popupSlice";
import {
  convertKeysToLowerCase,
  handleError,
  objectToString,
  splitAtFirstOccurrence,
  trimObj,
  validateCSVData,
} from "src/utils/common";
import { useAPI } from "src/utils/hooks";
import { DeleteIcon, PlusIcon, UploadIcon } from "src/utils/svgs";
import { ASSESSMENTS_URL } from "src/utils/urls";
import { validateEmail } from "src/utils/validators";
import * as XLSX from "xlsx";

import {
  AssessmentInvites,
  InviteFormData,
  InviteFormProps,
} from "./InviteForm.types";

const InviteForm: React.FC<InviteFormProps> = (props) => {
  const { onClose, assessmentID, callback } = props;
  const dispatch = useAppDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const [bulkImport, setBulkImport] = useState(false);
  const { data: inviteData, loading } = useAPI<AssessmentInvites>(
    `${ASSESSMENTS_URL}${assessmentID}/invites/`
  );
  const form = useForm<InviteFormData>({
    defaultValues: {
      assessment: assessmentID,
      candidates: [{ name: "", email: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "candidates",
  });
  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      blankrows: false,
    });
    const formattedData = trimObj(convertKeysToLowerCase(jsonData));
    if (validateCSVData(formattedData)) {
      const formattedString = objectToString(formattedData);
      form.setValue("bulkCandidates", formattedString);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.reset();
    form.setValue("bulkCandidates", "");
    form.setValue("candidates", [{ name: "", email: "" }]);
    setBulkImport(event.target.checked);
  };
  const onSubmit = (formData: InviteFormData) => {
    setFormLoading(true);
    inviteCandidates(formData)
      .then(() => {
        form.reset();
        toast.success("Candidate invited successfully");
        dispatch(updateAdditionCount());
        callback(formData.candidates.length);
        onClose();
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };
  if (loading) {
    return (
      <Box sx={{ flexGrow: 1 }} padding="100px">
        <Loader />
      </Box>
    );
  }
  return (
    <Box
      component="form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      sx={{ flexGrow: 1 }}
      padding="20px"
    >
      <Grid container gap={2}>
        <Grid xs={12}>
          <Stack gap={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              marginBottom={2}
            >
              <Stack gap={1} direction="row" alignItems="center">
                <Typography fontSize={12}>Bulk Import</Typography>
                <Switch
                  checked={bulkImport}
                  onChange={handleChange}
                  size="small"
                />
              </Stack>
              {bulkImport ? (
                <Stack direction="row" gap={1}>
                  <Box>
                    <a download="sample.csv" href="/sample.csv">
                      <Button variant="text" component="span">
                        <Typography fontSize={12}>Download Sample</Typography>
                      </Button>
                    </a>
                  </Box>
                  <Box>
                    <input
                      type="file"
                      hidden
                      onInput={(e) => handleFile(e)}
                      id="raised-button-file"
                    />
                    <label htmlFor="raised-button-file">
                      <Button variant="text" component="span">
                        <UploadIcon />
                        <Typography marginLeft={1} fontSize={12}>
                          Upload
                        </Typography>
                      </Button>
                    </label>
                  </Box>
                </Stack>
              ) : null}
            </Stack>
            <Typography fontSize={14} fontWeight={500}>
              Candidate Details
            </Typography>
            {bulkImport ? (
              <Controller
                name="bulkCandidates"
                control={form.control}
                rules={{
                  required: "The field is required",
                  validate: {
                    format: (value) => {
                      const entries = value.split("\n");
                      let message = "";
                      const is_valid = entries.every((entry) => {
                        if (!entry) {
                          return true;
                        }
                        const data = splitAtFirstOccurrence(entry, " ");
                        const email = data[0] ?? "";
                        const isEmailValid = validateEmail(email);
                        const isEmailUnique = inviteData.invites.every(
                          (invite) =>
                            invite.email !== email ||
                            (invite.email === email && invite.is_revoked)
                        );
                        if (!isEmailValid) message = `Invalid email ${email}`;
                        if (!isEmailUnique) message = `Existing email ${email}`;
                        return isEmailValid && isEmailUnique;
                      });
                      if (!is_valid) {
                        return message;
                      }
                      return undefined;
                    },
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    id="bulk_candidate_details"
                    placeholder="Email Name"
                    name="bulk_candidate_details"
                    autoFocus
                    value={value || ""}
                    onChange={onChange}
                    error={Boolean(form.formState.errors.bulkCandidates)}
                    helperText={form.formState.errors.bulkCandidates?.message}
                    size="small"
                    multiline
                    rows={6}
                  />
                )}
              />
            ) : (
              <Grid container width="100%" gap={2} py={2}>
                {fields.map((item, index) => (
                  <Grid xs={12} key={item.id}>
                    <Grid container gap={2}>
                      <Grid xs={5} p={0} m={0}>
                        <Controller
                          name={`candidates.${index}.email`}
                          control={form.control}
                          rules={{
                            required: "The field is required",
                            validate: {
                              email: (value) => {
                                const isEmailValid = validateEmail(value);
                                const isEmailUnique = inviteData.invites.every(
                                  (invite) =>
                                    invite.email !== value ||
                                    (invite.email === value &&
                                      invite.is_revoked)
                                );
                                if (!isEmailValid) {
                                  return "Invalid email";
                                }
                                if (!isEmailUnique) {
                                  return "Candidate already invited";
                                }
                              },
                            },
                          }}
                          render={({ field: { onChange, value } }) => (
                            <TextField
                              margin="none"
                              id="email"
                              placeholder="Email Address"
                              name="email"
                              autoComplete="email"
                              value={value || ""}
                              onChange={onChange}
                              error={Boolean(
                                form.formState.errors.candidates?.[index]?.email
                                  ?.message
                              )}
                              helperText={
                                form.formState.errors.candidates?.[index]?.email
                                  ?.message
                              }
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      <Grid xs={5} p={0} m={0}>
                        <Controller
                          name={`candidates.${index}.name`}
                          control={form.control}
                          rules={{
                            required: "The field is required",
                          }}
                          render={({ field: { onChange, value } }) => (
                            <TextField
                              margin="none"
                              id="name"
                              autoComplete="name"
                              placeholder="Name"
                              value={value || ""}
                              onChange={onChange}
                              error={Boolean(
                                form.formState.errors.candidates?.[index]?.name
                                  ?.message
                              )}
                              helperText={
                                form.formState.errors.candidates?.[index]?.name
                                  ?.message
                              }
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      <Grid
                        xs={1}
                        p={0}
                        m={0}
                        display="flex"
                        alignItems="center"
                        justifyContent={
                          index === fields.length - 1
                            ? "space-between"
                            : "center"
                        }
                      >
                        <IconButton
                          onClick={() => remove(index)}
                          disabled={index === 0}
                        >
                          <DeleteIcon />
                        </IconButton>
                        {index === fields.length - 1 && (
                          <IconButton
                            onClick={() => {
                              append({ name: "", email: "" });
                            }}
                          >
                            <PlusIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>
        </Grid>
        <Grid xs={5}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Expiry (optional)
            </Typography>
            <Controller
              name="expiry"
              control={form.control}
              render={({
                field: { onChange, value, ...restField },
                fieldState: { error },
              }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={value ? dayjs(value) : null}
                    onChange={onChange}
                    sx={{ width: "100%" }}
                    minDate={dayjs().add(1, "day")}
                    slotProps={{ textField: { size: "small", error: !!error } }}
                    {...restField}
                  />
                </LocalizationProvider>
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={formLoading}
            sx={{ marginTop: 2 }}
          >
            {formLoading ? <SmallLoader /> : "Invite"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InviteForm;
