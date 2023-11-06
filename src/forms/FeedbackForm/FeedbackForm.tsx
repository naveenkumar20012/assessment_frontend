import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { submitFeedback } from "src/calls/respondent";
import SmallLoader from "src/components/Loader/SmallLoader";
import { handleError } from "src/utils/common";

import { FeedbackFormData, FeedbackFormProps } from "./FeedbackForm.types";

const FeedbackForm: React.FC<FeedbackFormProps> = (props) => {
  const { invite } = props;
  const [formLoading, setFormLoading] = useState(false);
  const form = useForm<FeedbackFormData>();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const onSubmit = (formData: FeedbackFormData) => {
    setFormLoading(true);
    submitFeedback({ ...formData, invite })
      .then(() => {
        toast.success("Thank you for the feedback");
        setFeedbackSubmitted(true);
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };
  if (feedbackSubmitted) {
    return <></>;
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
          <Typography fontSize={16} fontWeight={500}>
            Please rate your assessment experience
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Rating
            </Typography>
            <Controller
              name="rating"
              control={form.control}
              rules={{
                required: "The field is required",
              }}
              render={({ field: { onChange, value } }) => (
                <Rating
                  name="rating"
                  value={value || 0}
                  onChange={(_, newValue) => {
                    onChange(newValue);
                  }}
                  size="large"
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Comments
            </Typography>
            <Controller
              name="comments"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  id="comments"
                  placeholder="comments"
                  value={value || ""}
                  onChange={onChange}
                  fullWidth
                  size="small"
                  multiline
                  rows={5}
                />
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
          >
            {formLoading ? <SmallLoader /> : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeedbackForm;
