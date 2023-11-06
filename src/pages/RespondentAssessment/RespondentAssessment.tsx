import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { Stack } from "@mui/system";
import markdownToTxt from "markdown-to-txt";
import { submitTest } from "src/calls/respondent";
import CountdownTimer from "src/components/CountdownTimer/CountdownTimer";
import Loader from "src/components/Loader/Loader";
import Markdown from "src/components/Markdown/Markdown";
import Ping from "src/components/Ping/Ping";
import PoweredBy from "src/components/PoweredBy/PoweredBy";
import SessionImage from "src/components/SessionImage/SessionImage";
import RespondentAssessmentForm from "src/forms/RespondentAssessmentForm/RespondentAssessmentForm";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { updateConfirmActionPopupState } from "src/redux/popupSlice";
import { handleError, shuffleArray } from "src/utils/common";
import { useAPI } from "src/utils/hooks";
import { AttemptedIcon, PyjamaHRIcon, ShortLogo } from "src/utils/svgs";
import { RESPONDENT_URL } from "src/utils/urls";

import Security from "../../components/Security/Security";
import {
  RenderFullCaseStudyBaseQuestionProps,
  RenderHalfCaseStudyBaseQuestionProps,
  RenderMCQQuestionsProps,
  RenderProgrammingQuestionsProps,
  RespondentAssessmentFormData,
  RespondentSelectedQuestion,
} from "./RespondentAssessment.types";

const RenderProgrammingQuestions: React.FC<RenderProgrammingQuestionsProps> = (
  props
) => {
  const {
    programmingQuestions,
    setSelectedQuestion,
    selectedQuestion,
    form,
    isCaseStudySelected,
    setIsCaseStudySelected,
  } = props;
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box>
        <Typography fontWeight={500}>
          {programmingQuestions?.length} Programming questions
        </Typography>
      </Box>
      <Box>
        <List
          sx={{
            border: (t) => `thin solid ${t.palette.grey[300]}`,
            borderRadius: 1.5,
            padding: 0,
          }}
        >
          {programmingQuestions?.map((question, index) => (
            <>
              <ListItem sx={{ cursor: "pointer" }} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setIsCaseStudySelected(false);
                    setSelectedQuestion({
                      ...question,
                      question_number: index + 1,
                    });
                  }}
                  sx={{
                    p: 2,
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                  }}
                  selected={
                    selectedQuestion?.uuid === question.uuid &&
                    !isCaseStudySelected
                  }
                >
                  <Typography>
                    {typeof form.getValues(question.uuid) !== "undefined" ? (
                      <AttemptedIcon />
                    ) : (
                      index + 1 + "."
                    )}
                  </Typography>
                  <Typography
                    component="div"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      wordBreak: "break-all",
                    }}
                  >
                    {markdownToTxt(question.body).trim()}
                  </Typography>
                </ListItemButton>
              </ListItem>
              {index !== programmingQuestions.length - 1 && <Divider />}
            </>
          ))}
        </List>
      </Box>
    </Box>
  );
};

const RenderMCQQuestions: React.FC<RenderMCQQuestionsProps> = (props) => {
  const {
    mcqs,
    programmingQuestions,
    setSelectedQuestion,
    selectedQuestion,
    form,
    isCaseStudySelected,
    setIsCaseStudySelected,
  } = props;
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box>
        <Typography fontWeight={500}>
          {mcqs?.length} Multiple choice questions
        </Typography>
      </Box>
      <Box>
        <List
          sx={{
            border: (t) => `thin solid ${t.palette.grey[300]}`,
            borderRadius: 1.5,
            padding: 0,
          }}
        >
          {mcqs
            ?.sort((a, b) => a.skill.name.localeCompare(b.skill.name))
            .map((question, index) => (
              <>
                <ListItem
                  sx={{
                    cursor: "pointer",
                  }}
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => {
                      setIsCaseStudySelected(false);
                      setSelectedQuestion({
                        ...question,
                        question_number:
                          (programmingQuestions?.length || 0) + index + 1,
                      });
                    }}
                    sx={{
                      p: 2,
                      display: "flex",
                      gap: 1,
                      alignItems: "flex-start",
                    }}
                    selected={
                      selectedQuestion?.uuid === question.uuid &&
                      !isCaseStudySelected
                    }
                  >
                    <Typography>
                      {typeof form.getValues(question.uuid) !== "undefined" ? (
                        <AttemptedIcon />
                      ) : (
                        (programmingQuestions?.length || 0) + index + 1 + "."
                      )}
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        pl: 0.5,
                        wordBreak: "break-all",
                      }}
                    >
                      {markdownToTxt(question.body).trim()}
                    </Typography>
                  </ListItemButton>
                </ListItem>
                {index !== mcqs.length - 1 && <Divider />}
              </>
            ))}
        </List>
      </Box>
    </Box>
  );
};

const RenderFullCaseStudyBaseQuestion: React.FC<
  RenderFullCaseStudyBaseQuestionProps
> = (props) => {
  const { base_question } = props;
  return (
    <Box height="calc(100% - 120px)" overflow="scroll">
      <Markdown data={base_question} />
    </Box>
  );
};

const RenderHalfCaseStudyBaseQuestion: React.FC<
  RenderHalfCaseStudyBaseQuestionProps
> = (props) => {
  const { base_question, isCaseStudySelected, setIsCaseStudySelected } = props;
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box>
        <Typography fontWeight={500}>Case study question</Typography>
      </Box>
      <Box>
        <List
          sx={{
            border: (t) => `thin solid ${t.palette.grey[300]}`,
            borderRadius: 1.5,
            padding: 0,
          }}
        >
          <ListItem sx={{ cursor: "pointer" }} disablePadding>
            <ListItemButton
              sx={{
                p: 2,
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
              }}
              onClick={() => {
                setIsCaseStudySelected(true);
              }}
              selected={isCaseStudySelected}
            >
              <Typography component="div">
                {markdownToTxt(base_question).trim()}
              </Typography>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

const RespondentAssessment = () => {
  const { inviteID } = useParams();
  const { data, loading } = useAPI<RespondentData>(
    `${RESPONDENT_URL}${inviteID}/`
  );
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = useForm<RespondentAssessmentFormData>();
  const {
    assessment_name,
    assessment_duration,
    is_ats,
    is_tab_switches_enabled,
    is_fullscreen_exits_enabled,
    is_shuffling_enabled,
    is_proctoring_enabled,
  } = useAppSelector((state) => state.respondent);
  const [selectedQuestion, setSelectedQuestion] =
    useState<RespondentSelectedQuestion | null>(null);
  const [isCaseStudySelected, setIsCaseStudySelected] = useState(false);
  const onConfirmAction = (formData: RespondentAssessmentFormData) => {
    setFormLoading(true);
    submitTest(inviteID || "", formData)
      .then(() => {
        navigate("../submited", { replace: true });
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };
  const forceSubmit = (formData: RespondentAssessmentFormData) => {
    onConfirmAction(formData);
  };
  const onSubmit = (formData: RespondentAssessmentFormData) => {
    const questionsAttempted = Object.keys(formData).filter((question) => {
      const answer = formData[question];
      if (!answer) {
        return false;
      }
      if (answer && !answer.length) {
        return false;
      }
      return true;
    }).length;
    dispatch(
      updateConfirmActionPopupState({
        isConfirmActionPopupOpen: true,
        confirmActionPopupProps: {
          pendingQuestions:
            (data.assessment?.questions.length || 0) - questionsAttempted,
          onAccept: () => {
            onConfirmAction(formData);
          },
        },
      })
    );
  };
  const mcqs =
    data?.assessment?.questions.filter(
      (question) => question.question_type === "MCQ"
    ) ?? [];
  const programmingQuestions =
    data?.assessment?.questions.filter(
      (question) => question.question_type === "PROGRAM"
    ) ?? [];
  const openEndedQuestions =
    data?.assessment?.questions.filter(
      (question) => question.question_type === "OPEN_ENDED"
    ) ?? [];
  let questionsToDislay: RespondentQuestion[] = [];
  if (data?.assessment?.assessment_type === "NON_TECHNICAL") {
    questionsToDislay = openEndedQuestions;
  } else if (
    data?.assessment?.assessment_type === "UNIFIED" &&
    isCaseStudySelected
  ) {
    questionsToDislay = openEndedQuestions;
  } else if (
    data?.assessment?.assessment_type === "UNIFIED" &&
    !isCaseStudySelected &&
    selectedQuestion
  ) {
    questionsToDislay = [selectedQuestion];
  } else if (selectedQuestion) {
    questionsToDislay = [selectedQuestion];
  }
  if (loading) {
    return <Loader />;
  }
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
      }}
      component="form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Security
        forceSubmit={() => form.handleSubmit(forceSubmit)()}
        inviteID={inviteID || ""}
        is_tab_switches_enabled={is_tab_switches_enabled}
        is_fullscreen_exits_enabled={is_fullscreen_exits_enabled}
        is_proctoring_enabled={is_proctoring_enabled}
      />
      <SessionImage
        inviteID={inviteID || ""}
        is_proctoring_enabled={is_proctoring_enabled}
      />
      <Ping inviteID={inviteID || ""} />
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          height: 64,
          borderBottom: (theme) => `thin solid ${theme.palette.grey[300]}`,
          display: "flex",
          alignItems: "center",
          p: 1,
          px: 3,
          justifyContent: "space-between",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          {is_ats ? (
            <PyjamaHRIcon />
          ) : (
            <ShortLogo style={{ height: 40, width: 40 }} />
          )}
          <Divider orientation="vertical" variant="middle" flexItem />
          <Typography
            variant="h6"
            sx={{ color: (t) => t.palette.grey[800], fontWeight: 500 }}
          >
            {assessment_name}
          </Typography>
        </Stack>
        <CountdownTimer
          duration={assessment_duration}
          forceSubmit={() => form.handleSubmit(forceSubmit)()}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={formLoading}
          color="error"
        >
          End Test
        </Button>
      </Paper>
      <Grid
        container
        width="100%"
        height="calc(100% - 64px)"
        padding={1}
        justifyContent="space-between"
      >
        <Grid xs={12} md={4} height="100%">
          <Paper
            elevation={0}
            variant="elevation"
            sx={{
              height: "100%",
              padding: "10px 25px",
            }}
          >
            <Box
              height="50px"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="caption">Total Questions</Typography>
                <Typography fontWeight={500}>
                  {data.assessment?.questions.length} questions
                </Typography>
              </Stack>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {data.assessment?.assessment_type === "TECHNICAL" && (
              <Box
                height="calc(100% - 120px)"
                display="flex"
                flexDirection="column"
                gap={2}
                overflow="scroll"
                sx={{ overflowX: "auto" }}
              >
                {Boolean(programmingQuestions.length) && (
                  <RenderProgrammingQuestions
                    programmingQuestions={programmingQuestions}
                    setSelectedQuestion={setSelectedQuestion}
                    setIsCaseStudySelected={setIsCaseStudySelected}
                    isCaseStudySelected={isCaseStudySelected}
                    selectedQuestion={selectedQuestion}
                    form={form}
                  />
                )}
                {Boolean(mcqs.length) && (
                  <RenderMCQQuestions
                    mcqs={mcqs}
                    programmingQuestions={programmingQuestions}
                    setSelectedQuestion={setSelectedQuestion}
                    selectedQuestion={selectedQuestion}
                    isCaseStudySelected={isCaseStudySelected}
                    setIsCaseStudySelected={setIsCaseStudySelected}
                    form={form}
                  />
                )}
              </Box>
            )}
            {data.assessment?.assessment_type === "NON_TECHNICAL" && (
              <RenderFullCaseStudyBaseQuestion
                base_question={data.assessment.base_question}
              />
            )}
            {data.assessment?.assessment_type === "UNIFIED" && (
              <Box
                height="calc(100% - 120px)"
                display="flex"
                flexDirection="column"
                gap={2}
                overflow="scroll"
                sx={{ overflowX: "auto" }}
              >
                {Boolean(programmingQuestions.length) && (
                  <RenderProgrammingQuestions
                    programmingQuestions={programmingQuestions}
                    setSelectedQuestion={setSelectedQuestion}
                    isCaseStudySelected={isCaseStudySelected}
                    setIsCaseStudySelected={setIsCaseStudySelected}
                    selectedQuestion={selectedQuestion}
                    form={form}
                  />
                )}
                {Boolean(mcqs.length) && (
                  <RenderMCQQuestions
                    mcqs={mcqs}
                    programmingQuestions={programmingQuestions}
                    setSelectedQuestion={setSelectedQuestion}
                    selectedQuestion={selectedQuestion}
                    isCaseStudySelected={isCaseStudySelected}
                    setIsCaseStudySelected={setIsCaseStudySelected}
                    form={form}
                  />
                )}
                {Boolean(data.assessment.base_question) && (
                  <RenderHalfCaseStudyBaseQuestion
                    base_question={data.assessment.base_question}
                    isCaseStudySelected={isCaseStudySelected}
                    setIsCaseStudySelected={setIsCaseStudySelected}
                  />
                )}
              </Box>
            )}
            <Box
              height="50px"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
            >
              <PoweredBy />
            </Box>
          </Paper>
        </Grid>
        <Grid xs={12} md={8} height="100%">
          <Paper
            elevation={0}
            variant="elevation"
            sx={{ ml: 2, p: 2, height: "100%", overflow: "scroll", pr: 2 }}
          >
            <RespondentAssessmentForm
              form={form}
              questions={questionsToDislay}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RespondentAssessment;
