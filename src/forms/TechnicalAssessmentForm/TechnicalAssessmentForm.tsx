import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { createTechnicalAssessment } from "src/calls/assessments";
import Loader from "src/components/Loader/Loader";
import { useAppSelector } from "src/redux/hooks";
import { handleError } from "src/utils/common";
import { useAPI } from "src/utils/hooks";
import languages from "src/utils/languages";
import { DeleteIcon, EditIcon } from "src/utils/svgs";
import { DIFFICULTIES_URL, SKILLS_URL } from "src/utils/urls";

import {
  AssessmentFormProps,
  Config,
  TechnicalAssessmentFormData,
  TechnicalAssessmentFormSetpOneProps,
  TechnicalAssessmentFormSetpThreeProps,
  TechnicalAssessmentFormSetpTwoProps,
} from "./TechnicalAssessmentForm.types";
import {
  generateQuestionMatrix,
  getAssessmentDuration,
  getDifficultyID,
  getQuestionsCountPerSkill,
  getSkillLevel,
  getSkillName,
  getSkillQuestionsCount,
  getSkillScore,
  getSkillScorePerDifficulty,
  getSkillType,
} from "./helpers";

const experiences = ["0 - 3 years", "4 - 6 years", "More than 6 years"];

const TechnicalAssessmentFormSetpOne: React.FC<
  TechnicalAssessmentFormSetpOneProps
> = (props) => {
  const { form, skills, onSubmit } = props;
  return (
    <>
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
                onChange={(_, updatedValue) => onChange(updatedValue)}
                value={value || []}
                multiple
                filterSelectedOptions
                id="skills"
                getOptionLabel={(option) => option.name}
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
      <Grid xs={12}>
        <Stack gap={1}>
          <Typography fontSize={14} fontWeight={500}>
            Experience
          </Typography>
          <Controller
            name="experience"
            control={form.control}
            rules={{
              required: "The field is required",
            }}
            render={({ field: { onChange, value } }) => (
              <ButtonGroup size="medium">
                {experiences.map((experience) => (
                  <Button
                    key={experience}
                    onClick={() => onChange(experience)}
                    sx={{
                      border: (t) =>
                        `thin solid ${
                          value === experience
                            ? t.palette.primary.main
                            : t.palette.grey[400]
                        } !important`,
                      bgcolor: (t) =>
                        value === experience
                          ? "#EBEFFF"
                          : t.palette.background.paper,
                      color: (t) =>
                        value === experience
                          ? t.palette.primary.main
                          : t.palette.grey[500],
                      textTransform: "none",
                      mr: 0.2,
                    }}
                  >
                    {experience}
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
            Restrict Programming Language (Optional)
          </Typography>
          <Controller
            name="restricted_languages"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                onChange={(_, updatedValue) => onChange(updatedValue)}
                value={value || []}
                filterSelectedOptions
                id="restricted_languages"
                options={languages.map((language) => language.label)}
                multiple
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder="Restrict Programming Language"
                    error={Boolean(form.formState.errors.restricted_languages)}
                    helperText={
                      form.formState.errors.restricted_languages?.message
                    }
                    required
                    size="small"
                  />
                )}
              />
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
                      onChange={(_, checked) => {
                        onChange(checked);
                      }}
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
      <Grid xs={12} justifyContent="flex-end" display="flex">
        <Button variant="contained" fullWidth onClick={onSubmit}>
          Continue
        </Button>
      </Grid>
    </>
  );
};

const TechnicalAssessmentFormSetpTwo: React.FC<
  TechnicalAssessmentFormSetpTwoProps
> = (props) => {
  const {
    configWatch,
    skills,
    difficulties,
    setSelectedSkill,
    step,
    setStep,
    removeSkillFromConfig,
    nameWatch,
    goBack,
    form,
  } = props;
  const { matrix } = useAppSelector((state) => state.auth.user.company);
  return (
    <>
      <Grid xs={12}>
        <Typography fontWeight={500} fontSize={18}>
          {nameWatch}
        </Typography>
      </Grid>
      <Grid xs={12}>
        <TableContainer component={Paper} elevation={0} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Skill</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Count</TableCell>
                <TableCell>Score</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(configWatch)
                .sort((a, b) =>
                  getSkillType(b, skills).localeCompare(getSkillType(a, skills))
                )
                .map((skill) => (
                  <TableRow
                    key={skill}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {getSkillName(skill, skills)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {getSkillLevel(skill, configWatch, difficulties)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {getSkillType(skill, skills)}
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      {getSkillQuestionsCount(skill, configWatch)}
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      {getSkillScore(
                        skill,
                        configWatch,
                        skills,
                        difficulties,
                        matrix
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row">
                        <IconButton
                          onClick={() => {
                            setSelectedSkill(skill);
                            setStep(step + 1);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => removeSkillFromConfig(skill)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
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
                onChange={onChange}
                value={value}
                error={Boolean(form.formState.errors.duration)}
                helperText={form.formState.errors.duration?.message}
                required
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
      <Grid xs={12} display="flex" justifyContent="space-between">
        <Button onClick={goBack} variant="outlined">
          Go Back
        </Button>
        <Button type="submit" variant="contained">
          Create Assessment
        </Button>
      </Grid>
    </>
  );
};

const TechnicalAssessmentFormSetpThree: React.FC<
  TechnicalAssessmentFormSetpThreeProps
> = (props) => {
  const {
    configWatch,
    selectedSkill,
    difficulties,
    onStepThreeSubmit,
    goBack,
    skills,
  } = props;
  const [localConfig, setLocaConfig] = useState(configWatch);
  const { matrix } = useAppSelector((state) => state.auth.user.company);
  const updateCount = (difficultyID: string, newValue: number) => {
    setLocaConfig({
      ...localConfig,
      [selectedSkill]: {
        ...localConfig[selectedSkill],
        [difficultyID]: newValue,
      },
    });
  };
  return (
    <>
      <Grid xs={12}>
        <Typography fontWeight={500} fontSize={18}>
          {getSkillName(selectedSkill, skills)} (
          {getSkillType(selectedSkill, skills)})
        </Typography>
      </Grid>
      <Grid xs={12}>
        <TableContainer component={Paper} elevation={0} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Level</TableCell>
                <TableCell>No. of Questions</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Easy</TableCell>
                <TableCell>
                  <Select
                    value={getQuestionsCountPerSkill(
                      selectedSkill,
                      localConfig,
                      "Easy",
                      difficulties
                    )}
                    onChange={(e) => {
                      updateCount(
                        getDifficultyID("Easy", difficulties),
                        Number(e.target.value)
                      );
                    }}
                    size="small"
                  >
                    {Array.from(Array(11).keys()).map((key) => (
                      <MenuItem value={key} key={key}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  {getSkillScorePerDifficulty(
                    selectedSkill,
                    "Easy",
                    localConfig,
                    skills,
                    difficulties,
                    matrix
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Medium</TableCell>
                <TableCell>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={getQuestionsCountPerSkill(
                      selectedSkill,
                      localConfig,
                      "Medium",
                      difficulties
                    )}
                    onChange={(e) => {
                      updateCount(
                        getDifficultyID("Medium", difficulties),
                        Number(e.target.value)
                      );
                    }}
                    size="small"
                  >
                    {Array.from(Array(11).keys()).map((key) => (
                      <MenuItem value={key} key={key}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  {getSkillScorePerDifficulty(
                    selectedSkill,
                    "Medium",
                    localConfig,
                    skills,
                    difficulties,
                    matrix
                  )}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>Hard</TableCell>
                <TableCell>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={getQuestionsCountPerSkill(
                      selectedSkill,
                      localConfig,
                      "Hard",
                      difficulties
                    )}
                    onChange={(e) => {
                      updateCount(
                        getDifficultyID("Hard", difficulties),
                        Number(e.target.value)
                      );
                    }}
                    size="small"
                  >
                    {Array.from(Array(11).keys()).map((key) => (
                      <MenuItem value={key} key={key}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  {getSkillScorePerDifficulty(
                    selectedSkill,
                    "Hard",
                    localConfig,
                    skills,
                    difficulties,
                    matrix
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid xs={12} display="flex" justifyContent="space-between">
        <Button onClick={goBack} variant="outlined">
          Go Back
        </Button>
        <Button
          onClick={() => onStepThreeSubmit(localConfig)}
          variant="contained"
        >
          Update Skill
        </Button>
      </Grid>
    </>
  );
};

const TechnicalAssessmentForm: React.FC<AssessmentFormProps> = (props) => {
  const { onClose } = props;
  const [formLoading, setFormLoading] = useState(false);
  const { matrix } = useAppSelector((state) => state.auth.user.company);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { data: skills, loading: isSkillsLoading } = useAPI<Skill[]>(
    `${SKILLS_URL}?skill_type=TECHNICAL`
  );
  const { data: difficulties, loading: isDifficultiesLoading } =
    useAPI<Difficulty[]>(DIFFICULTIES_URL);
  const form = useForm<TechnicalAssessmentFormData>({
    mode: "onChange",
    defaultValues: {
      experience: "0 - 3 years",
      is_tab_switches_enabled: true,
      is_fullscreen_exits_enabled: true,
      is_shuffling_enabled: true,
      is_proctoring_enabled: true,
    },
  });
  const [selectedSkill, setSelectedSkill] = useState("");
  const nameWatch = form.watch("name");
  const skillsWatch = form.watch("skills");
  const experienceWatch = form.watch("experience");
  const configWatch = form.watch("config");
  const durationWatch = form.watch("duration");
  useEffect(() => {
    form.setValue(
      "duration",
      getAssessmentDuration(configWatch, skills, matrix)
    );
  }, [configWatch]);
  const goBack = () => {
    setStep(step - 1);
  };
  const removeSkillFromConfig = (uuid: string) => {
    let updatedConfig = { ...configWatch };
    delete updatedConfig[uuid];
    form.setValue("config", updatedConfig);
  };
  const onStepOneSubmit = () => {
    const valid = form.trigger();
    valid.then((res) => {
      if (res) {
        const config = generateQuestionMatrix(
          difficulties,
          experienceWatch,
          skillsWatch,
          skills
        );
        form.setValue("config", config);
        setStep(step + 1);
      }
    });
  };
  const onStepThreeSubmit = (newConfig: Config) => {
    form.setValue("config", newConfig);
    setStep(1);
  };
  const onSubmit = (formData: TechnicalAssessmentFormData) => {
    setFormLoading(true);
    createTechnicalAssessment(formData)
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
      <Grid container spacing={3}>
        {step === 0 && (
          <TechnicalAssessmentFormSetpOne
            form={form}
            skills={skills}
            onSubmit={onStepOneSubmit}
          />
        )}
        {step === 1 && (
          <TechnicalAssessmentFormSetpTwo
            configWatch={configWatch}
            skills={skills}
            difficulties={difficulties}
            setSelectedSkill={setSelectedSkill}
            durationWatch={durationWatch}
            step={step}
            setStep={setStep}
            removeSkillFromConfig={removeSkillFromConfig}
            nameWatch={nameWatch}
            goBack={goBack}
            form={form}
          />
        )}
        {Boolean(step === 2 && selectedSkill) && (
          <TechnicalAssessmentFormSetpThree
            configWatch={configWatch}
            selectedSkill={selectedSkill}
            difficulties={difficulties}
            onStepThreeSubmit={onStepThreeSubmit}
            goBack={goBack}
            skills={skills}
          />
        )}
      </Grid>
    </Box>
  );
};

export default TechnicalAssessmentForm;
