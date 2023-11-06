import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Loader from "src/components/Loader/Loader";
import SmallLoader from "src/components/Loader/SmallLoader";
import { useAppSelector } from "src/redux/hooks";
import { useAPI } from "src/utils/hooks";
import { DIFFICULTIES_URL } from "src/utils/urls";

import {
  EditQuestionFormData,
  EditQuestionFormProps,
} from "./EditQuestionForm.types";
import { getScore } from "./helpers";

const EditQuestionForm: React.FC<EditQuestionFormProps> = (props) => {
  const { question, onCancel, onSubmit } = props;
  const { matrix } = useAppSelector((state) => state.auth.user.company);
  const [formLoading, setFormLoading] = useState(false);
  const form = useForm<EditQuestionFormData>({
    defaultValues: {
      new_question: question.body,
      new_question_difficulty: question.difficulty.uuid,
    },
  });
  const { data: difficulties, loading: isDifficultiesLoading } =
    useAPI<Difficulty[]>(DIFFICULTIES_URL);
  const difficultyWatch = form.watch("new_question_difficulty");
  const onSubmitForm = (formData: EditQuestionFormData) => {
    setFormLoading(true);
    onSubmit(formData, question.uuid, () => {
      setFormLoading(false);
      onCancel();
    });
  };
  if (isDifficultiesLoading) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Loader />
      </Box>
    );
  }
  return (
    <Box
      component="form"
      noValidate
      onSubmit={form.handleSubmit(onSubmitForm)}
      sx={{ flexGrow: 1 }}
      padding="20px"
    >
      <Grid container gap={2}>
        <Grid xs={12}>
          <Controller
            name="new_question"
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
        </Grid>
        <Grid xs={6}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Difficulty
            </Typography>
            <Controller
              name="new_question_difficulty"
              control={form.control}
              rules={{
                required: "The field is required",
              }}
              render={({ field: { onChange, value } }) => (
                <ButtonGroup fullWidth size="medium">
                  {difficulties?.map((difficulty) => (
                    <Button
                      key={difficulty.uuid}
                      onClick={() => onChange(difficulty.uuid)}
                      sx={{
                        border: (t) =>
                          `thin solid ${
                            value === difficulty.uuid
                              ? t.palette.primary.main
                              : t.palette.grey[300]
                          } !important`,
                        bgcolor: (t) =>
                          value === difficulty.uuid
                            ? "#EBEFFF"
                            : t.palette.background.paper,
                        color: (t) =>
                          value === difficulty.uuid
                            ? t.palette.primary.main
                            : t.palette.grey[500],
                        textTransform: "none",
                        mr: 0.2,
                      }}
                    >
                      {difficulty.name}
                    </Button>
                  ))}
                </ButtonGroup>
              )}
            />
          </Stack>
        </Grid>
        <Grid xs={5}>
          <Stack gap={1}>
            <Typography fontSize={14} fontWeight={500}>
              Score
            </Typography>
            <TextField
              disabled
              value={getScore(difficultyWatch, question.question_type, matrix)}
              size="small"
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack gap={1} direction="row" justifyContent="flex-end">
            <Button
              variant="outlined"
              disabled={formLoading}
              onClick={onCancel}
            >
              {formLoading ? <SmallLoader /> : "Cancel"}
            </Button>
            <Button type="submit" variant="contained" disabled={formLoading}>
              {formLoading ? <SmallLoader /> : "Submit"}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditQuestionForm;
