import { Controller } from "react-hook-form";

import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CodeEditor from "src/components/CodeEditor/CodeEditor";
import Markdown from "src/components/Markdown/Markdown";

import { RespondentAssessmentFormProps } from "./RespondentAssessmentForm.types";
import { AttemptedIcon } from "src/utils/svgs";

const RespondentAssessmentForm: React.FC<RespondentAssessmentFormProps> = (
  props
) => {
  const { form, questions } = props;
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {questions
        .sort((a, b) => a.uuid.localeCompare(b.uuid))
        .map((question, index) => (
          <Grid
            container
            spacing={1}
            key={question.uuid}
            sx={{
              borderColor: (t) => t.palette.grey[300],
              paddingBottom: 1,
            }}
          >
            <Grid xs={12}>
              <Box display="flex" alignItems="center">
                <Typography>
                  Question{" "}
                  {question.question_number
                    ? question.question_number
                    : index + 1}
                </Typography>
                {typeof form.getValues(question.uuid) !== "undefined" &&
                  question.question_type !== "OPEN_ENDED" && (
                    <Typography
                      display="flex"
                      alignItems="center"
                      marginLeft="8px"
                    >
                      <AttemptedIcon />
                      <span className={"attempted-text"}>Attempted</span>
                    </Typography>
                  )}
              </Box>
            </Grid>
            <Grid xs={12}>
              <Divider />
            </Grid>
            <Grid xs={12}>
              <Markdown data={question.body} />
            </Grid>
            <Grid xs={12}>
              <Controller
                name={question.uuid}
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <>
                    {/* ------------------MCQ question with a multiple answer (checkboxes)---------------------- */}
                    {Boolean(
                      question.question_type === "MCQ" && question.is_multi
                    ) && (
                      <FormControl component="fieldset" variant="standard">
                        <FormGroup>
                          {question.options.map((option) => (
                            <Stack
                              direction="row"
                              alignItems="center"
                              gap={1}
                              key={option.uuid}
                            >
                              <FormControlLabel
                                key={option.uuid}
                                control={
                                  <Checkbox
                                    sx={{
                                      "& .MuiSvgIcon-root": {
                                        fontSize: 18,
                                      },
                                    }}
                                    checked={
                                      value?.includes(option.uuid) || false
                                    }
                                    onChange={(_, checked) => {
                                      onChange(
                                        checked
                                          ? [
                                              ...(value ? value : []),
                                              option.uuid,
                                            ]
                                          : [
                                              ...value.filter(
                                                (uuid) => uuid !== option.uuid
                                              ),
                                            ]
                                      );
                                    }}
                                  />
                                }
                                sx={{ margin: 0 }}
                                label=""
                              />
                              <Markdown data={option.body} />
                            </Stack>
                          ))}
                        </FormGroup>
                      </FormControl>
                    )}
                    {/* ------------------MCQ question with a single answer (radio buttons)---------------------- */}
                    {Boolean(
                      question.question_type === "MCQ" && !question.is_multi
                    ) && (
                      <FormControl>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                          value={value && value.length ? value[0] : null}
                          onChange={(_, updatedValue) =>
                            onChange([updatedValue])
                          }
                        >
                          {question.options.map((option) => (
                            <Stack
                              direction="row"
                              alignItems="center"
                              gap={1}
                              key={option.uuid}
                            >
                              <FormControlLabel
                                key={option.uuid}
                                value={option.uuid}
                                control={
                                  <Radio
                                    sx={{
                                      "& .MuiSvgIcon-root": {
                                        fontSize: 18,
                                      },
                                    }}
                                  />
                                }
                                label=""
                                sx={{ margin: 0 }}
                              />
                              <Markdown data={option.body} />
                            </Stack>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                    {/* ------------------Coding question (code editor)----------------------- */}
                    {question.question_type === "PROGRAM" && (
                      <CodeEditor onChange={onChange} value={value} />
                    )}
                    {/* ------------------Open ended question (test area)--------------------- */}
                    {question.question_type === "OPEN_ENDED" && (
                      <Stack gap={2}>
                        <TextField
                          onChange={(e) => onChange([e.target.value])}
                          value={value ? value[0] : ""}
                          fullWidth
                          multiline
                          rows={6}
                          inputProps={{ maxLength: 1500 }}
                        />
                        <Typography textAlign="right">
                          {(value ? value[0] : "").length}/1500 characters used
                        </Typography>
                      </Stack>
                    )}
                  </>
                )}
              />
            </Grid>
          </Grid>
        ))}
    </Box>
  );
};

export default RespondentAssessmentForm;
