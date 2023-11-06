import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Checkbox, Divider, InputAdornment, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import {
  createNonTechnicalAssessment,
  regenerateNonTechnicalAssessment,
  updateNonTechnicalAssessment,
} from "src/calls/assessments";
import Loader from "src/components/Loader/Loader";
import Markdown from "src/components/Markdown/Markdown";
import { useAppSelector } from "src/redux/hooks";
import { generateUUID, handleError } from "src/utils/common";
import { useAPI } from "src/utils/hooks";
import { DIFFICULTIES_URL, SKILLS_URL } from "src/utils/urls";

import {
  NonTechnicalAssessmentsFormData,
  NonTechnicalAssessmentsFormProps,
  QuestionFormData,
} from "./NonTechnicalAssessmentsForm.types";
import { getAssessmentDuration } from "./helpers";

const filter = createFilterOptions<Skill>();

const NonTechnicalAssessmentsForm: React.FC<
  NonTechnicalAssessmentsFormProps
> = (props) => {
  const { onClose } = props;
  const [formLoading, setFormLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [originalData, setOriginalData] = useState<QuestionFormData>({
    uuid: "",
    base_question: "",
    questions: [],
  });
  const navigate = useNavigate();
  const { data: skills, loading: isSkillsLoading } = useAPI<Skill[]>(
    `${SKILLS_URL}?skill_type=NON_TECHNICAL`
  );
  const { data: difficulties, loading: isDifficultiesLoading } =
    useAPI<Difficulty[]>(DIFFICULTIES_URL);
  const form = useForm<NonTechnicalAssessmentsFormData>({
    defaultValues: {
      is_tab_switches_enabled: true,
      is_fullscreen_exits_enabled: true,
      is_shuffling_enabled: true,
      is_proctoring_enabled: true,
    },
  });
  const questionForm = useForm<QuestionFormData>();
  const { fields } = useFieldArray({
    control: questionForm.control,
    name: "questions",
  });
  const assessmentID = questionForm.watch("uuid");
  const { matrix } = useAppSelector((state) => state.auth.user.company);
  const difficultyWatch = form.watch("difficulty");
  useEffect(() => {
    form.setValue("duration", getAssessmentDuration(difficultyWatch, matrix));
  }, [difficultyWatch]);
  useEffect(() => {
    if (difficulties) {
      form.setValue(
        "difficulty",
        difficulties.find((difficulty) => difficulty.name === "Easy")?.uuid ||
          ""
      );
    }
  }, [difficulties]);
  const onSubmit = (formData: NonTechnicalAssessmentsFormData) => {
    setFormLoading(true);
    createNonTechnicalAssessment(formData)
      .then((res) => {
        setOriginalData(res);
        questionForm.setValue("uuid", res.uuid);
        questionForm.setValue("base_question", res.base_question);
        questionForm.setValue("questions", res.questions);
        setStep(1);
      })
      .catch((err) => {
        handleError(err);
        setStep(0);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };
  const regenerate = () => {
    setFormLoading(true);
    regenerateNonTechnicalAssessment(assessmentID)
      .then((res) => {
        setOriginalData(res);
        questionForm.setValue("uuid", res.uuid);
        questionForm.setValue("base_question", res.base_question);
        questionForm.setValue("questions", res.questions);
        setStep(1);
      })
      .catch((err) => {
        handleError(err);
        setStep(0);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };
  const onFinalSubmit = (formData: QuestionFormData) => {
    setFormLoading(true);
    updateNonTechnicalAssessment(assessmentID, formData)
      .then((res) => {
        form.reset();
        toast.success("Assessment created successfully");
        onClose();
        navigate(`/assessments/${res.uuid}`);
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };
  if (isSkillsLoading || isDifficultiesLoading || formLoading) {
    return (
      <Box sx={{ flexGrow: 1 }} padding="100px">
        {formLoading ? (
          <Stack gap={5} alignContent="center" justifyContent="center">
            <Loader />
            <Typography
              color={(t) => t.palette.grey[500]}
              textAlign="center"
              fontSize={14}
            >
              Generating assessment, this may take upto 30 secs
            </Typography>
          </Stack>
        ) : (
          <Loader />
        )}
      </Box>
    );
  }
  return (
    <Box sx={{ flexGrow: 1 }} padding="20px">
      {step === 0 && (
        <Grid
          container
          spacing={3}
          component="form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Grid xs={12}>
            <Stack gap={1}>
              <Typography fontSize={14} fontWeight={500}>
                Assessment Name
              </Typography>
              <Controller
                name="name"
                control={form.control}
                rules={{
                  required: "The field is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    onChange={onChange}
                    value={value || ""}
                    fullWidth
                    placeholder="Name"
                    error={Boolean(form.formState.errors.name)}
                    helperText={form.formState.errors.name?.message}
                    required
                    size="small"
                    autoFocus
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Stack gap={1}>
              <Typography fontSize={14} fontWeight={500}>
                Select Skills
              </Typography>
              <Controller
                name="skills"
                control={form.control}
                rules={{
                  required: "The field is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    onChange={(_, updatedValue) => {
                      const changedValues = updatedValue.map((value) => {
                        if (typeof value === "string") {
                          return {
                            uuid: generateUUID(),
                            name: value,
                            skill_type: "NON_TECHNICAL",
                            is_visible: true,
                          };
                        } else if (value.temporary) {
                          return { ...value, name: value.actualValue };
                        }
                        return value;
                      });
                      onChange(changedValues);
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some(
                        (option) => inputValue === option.name
                      );
                      if (inputValue !== "" && !isExisting) {
                        filtered.push({
                          uuid: generateUUID(),
                          name: `Add "${inputValue}"`,
                          skill_type: "NON_TECHNICAL",
                          is_visible: true,
                          temporary: true,
                          actualValue: inputValue,
                        });
                      }
                      return filtered;
                    }}
                    value={value || []}
                    multiple
                    freeSolo
                    selectOnFocus
                    clearOnBlur
                    filterSelectedOptions
                    id="skills"
                    getOptionLabel={(option) => (option as Skill).name}
                    isOptionEqualToValue={(option, value) =>
                      option.uuid === value.uuid
                    }
                    options={skills?.filter((skill) => skill.is_visible) || []}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        placeholder={value?.length ? "" : "Skills"}
                        error={Boolean(form.formState.errors.skills)}
                        helperText={form.formState.errors.skills?.message}
                        required
                        size="small"
                      />
                    )}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid xs={6}>
            <Stack gap={1}>
              <Typography fontSize={14} fontWeight={500}>
                Industry
              </Typography>
              <Controller
                name="industry"
                control={form.control}
                rules={{
                  required: "The field is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    onChange={onChange}
                    value={value || ""}
                    fullWidth
                    placeholder="Industry"
                    error={Boolean(form.formState.errors.industry)}
                    helperText={form.formState.errors.industry?.message}
                    required
                    size="small"
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid xs={6}>
            <Stack gap={1}>
              <Typography fontSize={14} fontWeight={500}>
                Duration
              </Typography>
              <Controller
                name="duration"
                control={form.control}
                rules={{
                  required: "The field is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    type="number"
                    fullWidth
                    onChange={onChange}
                    value={value}
                    error={Boolean(form.formState.errors.duration)}
                    helperText={form.formState.errors.duration?.message}
                    required
                    placeholder="Duration"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">Mins</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid xs={6}>
            <Stack gap={1}>
              <Typography fontSize={14} fontWeight={500}>
                Difficulty
              </Typography>
              <Controller
                name="difficulty"
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
          <Grid xs={12}>
            <Stack gap={1}>
              <Typography fontSize={14} fontWeight={500}>
                Security
              </Typography>
              <Grid container spacing={1}>
                <Grid xs={6}>
                  <Stack gap={1} direction="row" alignItems="center">
                    <Controller
                      name="is_tab_switches_enabled"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(_, checked) => onChange(checked)}
                        />
                      )}
                    />
                    <Typography fontSize={14} fontWeight={500}>
                      Enable tab switch check
                    </Typography>
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack gap={1} direction="row" alignItems="center">
                    <Controller
                      name="is_fullscreen_exits_enabled"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(_, checked) => onChange(checked)}
                        />
                      )}
                    />
                    <Typography fontSize={14} fontWeight={500}>
                      Enable fullscreen exits check
                    </Typography>
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack gap={1} direction="row" alignItems="center">
                    <Controller
                      name="is_shuffling_enabled"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(_, checked) => onChange(checked)}
                        />
                      )}
                    />
                    <Typography fontSize={14} fontWeight={500}>
                      Enable question shuffling
                    </Typography>
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack gap={1} direction="row" alignItems="center">
                    <Controller
                      name="is_proctoring_enabled"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(_, checked) => onChange(checked)}
                        />
                      )}
                    />
                    <Typography fontSize={14} fontWeight={500}>
                      Enable proctoring
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Button type="submit" fullWidth variant="contained">
              Create Assessment
            </Button>
          </Grid>
        </Grid>
      )}
      {step === 1 && (
        <Grid
          container
          spacing={3}
          component="form"
          noValidate
          onSubmit={questionForm.handleSubmit(onFinalSubmit)}
        >
          <Grid container height={500} overflow="scroll" marginRight={1}>
            <Grid xs={12}>
              <Stack gap={1}>
                <Typography fontSize={16} fontWeight={500}>
                  Case Study
                </Typography>
                <Typography fontSize={15}>
                  <Markdown data={questionForm.getValues("base_question")} />
                </Typography>
              </Stack>
            </Grid>
            {fields.map((field, index) => (
              <Grid xs={12} key={field.uuid}>
                <Stack gap={1}>
                  <Divider sx={{ mb: 1 }} />
                  <Typography fontSize={16} fontWeight={500}>
                    Question {index + 1}
                  </Typography>
                  <Typography fontSize={15}>{field.body}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Grid xs={12}>
            <Stack direction="row" justifyContent="space-between" marginTop={2}>
              <Stack direction="row" gap={2}>
                <Button onClick={regenerate} variant="outlined">
                  Regenerate
                </Button>
                <Button onClick={() => setStep(2)} variant="outlined">
                  Edit
                </Button>
              </Stack>
              <Button type="submit" variant="contained">
                Continue
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}
      {step === 2 && (
        <Grid
          container
          spacing={3}
          component="form"
          noValidate
          onSubmit={questionForm.handleSubmit(onFinalSubmit)}
        >
          <Grid container height={500} overflow="scroll" marginRight={1}>
            <Grid xs={12}>
              <Stack gap={1}>
                <Typography fontSize={14} fontWeight={500}>
                  Base Question
                </Typography>
                <Controller
                  name="base_question"
                  control={questionForm.control}
                  rules={{
                    required: "The field is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      onChange={onChange}
                      value={value || ""}
                      error={Boolean(
                        questionForm.formState.errors.base_question
                      )}
                      helperText={
                        questionForm.formState.errors.base_question?.message
                      }
                      required
                      placeholder="Base Question"
                      size="small"
                      multiline
                    />
                  )}
                />
              </Stack>
            </Grid>
            {fields.map((field, index) => (
              <Grid xs={12} key={field.uuid}>
                <Stack gap={1}>
                  <Typography fontSize={14} fontWeight={500}>
                    Question {index + 1}
                  </Typography>
                  <Controller
                    name={`questions.${index}.body`}
                    control={questionForm.control}
                    rules={{
                      required: "The field is required",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        fullWidth
                        onChange={onChange}
                        value={value || ""}
                        error={Boolean(
                          questionForm.formState.errors.questions?.[index]?.body
                        )}
                        helperText={
                          questionForm.formState.errors.questions?.[index]?.body
                            ?.message
                        }
                        required
                        placeholder={`Question ${index + 1}`}
                        size="small"
                        multiline
                        rows={5}
                      />
                    )}
                  />
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Grid xs={12}>
            <Stack direction="row" justifyContent="space-between" marginTop={2}>
              <Button
                onClick={() => {
                  questionForm.setValue(
                    "base_question",
                    originalData.base_question
                  );
                  questionForm.setValue("questions", originalData.questions);
                  setStep(1);
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button onClick={() => setStep(1)} variant="contained">
                Save
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default NonTechnicalAssessmentsForm;
