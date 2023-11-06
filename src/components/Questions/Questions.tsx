import { useState } from "react";

import { IconButton, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { editQuestion, regenerateQuestion } from "src/calls/assessments";
import Loader from "src/components/Loader/Loader";
import EditQuestionForm from "src/forms/EditQuestionForm/EditQuestionForm";
import { groupByKey, handleError } from "src/utils/common";
import { useAPI } from "src/utils/hooks";
import { ReloadIcon, SimpleEditIcon } from "src/utils/svgs";
import { ASSESSMENTS_URL } from "src/utils/urls";

import Markdown from "../Markdown/Markdown";
import { EditQuestionFormData, QuestionsProps } from "./Questions.types";

const Questions: React.FC<QuestionsProps> = (props) => {
  const { assessmentID } = props;
  const { data, loading, setData } = useAPI<AssessmentQuestions>(
    `${ASSESSMENTS_URL}${assessmentID}/questions/`
  );
  const [regenerateLoading, setRegenerateLoading] = useState<null | string>(
    null
  );
  const [editQuestionID, setEditQuestionID] = useState<null | string>(null);
  const onRegenerateClick = (questionID: string) => {
    setRegenerateLoading(questionID);
    regenerateQuestion(assessmentID, questionID)
      .then((res) => {
        setData({
          ...data,
          questions: [
            ...data.questions?.map((question) => {
              if (question.uuid === questionID) {
                return res;
              }
              return question;
            }),
          ],
        });
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setRegenerateLoading(null);
      });
  };
  const onEditSubmit = (
    formData: EditQuestionFormData,
    existingQuestionID: string,
    callback: () => void
  ) => {
    editQuestion(assessmentID, {
      ...formData,
      existing_question: existingQuestionID,
    })
      .then((res) => {
        setData({
          ...data,
          questions: [
            ...data.questions.map((question) => {
              if (question.uuid === existingQuestionID) {
                return res;
              }
              return question;
            }),
          ],
        });
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        callback();
      });
  };
  const mcqs =
    data?.questions.filter((question) => question.question_type === "MCQ") ??
    [];
  const programmingQuestions =
    data?.questions.filter(
      (question) => question.question_type === "PROGRAM"
    ) ?? [];
  const openEndedQuestions =
    data?.questions.filter(
      (question) => question.question_type === "OPEN_ENDED"
    ) ?? [];
  const groupedMCQs = groupByKey(mcqs ?? []) ?? {};
  if (loading) {
    return (
      <Box sx={{ flexGrow: 1 }} padding="100px">
        <Loader />
      </Box>
    );
  }
  return (
    <Grid container spacing={3}>
      <Grid sm={12}>
        <Paper elevation={0} variant="outlined" sx={{ padding: 2 }}>
          {openEndedQuestions?.length > 0 ? (
            <Typography fontWeight={500}>Case Study</Typography>
          ) : (
            <Typography fontWeight={500}>
              Questions (Programming {programmingQuestions.length}, MCQ{" "}
              {mcqs.length})
            </Typography>
          )}
        </Paper>
      </Grid>
      {programmingQuestions.length > 0 && (
        <>
          <Grid sm={12}>
            <Box display="flex" gap={2}>
              <Typography fontWeight={500}>Programming</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Divider sx={{ width: "100%" }} />
              </Box>
            </Box>
          </Grid>
          <Grid sm={12}>
            <Paper elevation={0} variant="outlined" sx={{ padding: 2 }}>
              <Grid container spacing={3}>
                {programmingQuestions.map((question, index) => (
                  <Grid sm={12} key={question.uuid}>
                    <Stack gap={2}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontWeight={500}>
                          Question {index + 1}
                        </Typography>
                        <Stack direction="row" gap={1}>
                          <Chip
                            label={`Skill: ${question.skill.name}`}
                            variant="outlined"
                          />
                          <Chip
                            label={`Difficulty: ${question.difficulty.name}`}
                            variant="outlined"
                          />
                          <Chip
                            label={`Score: ${question.points}`}
                            variant="outlined"
                          />
                          <>
                            <IconButton
                              onClick={() => onRegenerateClick(question.uuid)}
                              disabled={
                                Boolean(regenerateLoading) ||
                                Boolean(editQuestionID)
                              }
                            >
                              <ReloadIcon
                                className={
                                  regenerateLoading === question.uuid
                                    ? "spinning"
                                    : ""
                                }
                                style={{ height: 16, width: 16 }}
                              />
                            </IconButton>
                            <IconButton
                              onClick={() => setEditQuestionID(question.uuid)}
                              disabled={
                                Boolean(regenerateLoading) ||
                                Boolean(editQuestionID)
                              }
                            >
                              <SimpleEditIcon
                                style={{ height: 16, width: 16 }}
                              />
                            </IconButton>
                          </>
                        </Stack>
                      </Stack>
                      {editQuestionID === question.uuid ? (
                        <EditQuestionForm
                          question={question}
                          onCancel={() => {
                            setEditQuestionID(null);
                          }}
                          onSubmit={onEditSubmit}
                        />
                      ) : (
                        <Markdown data={question.body} />
                      )}
                      {index !== programmingQuestions.length - 1 && <Divider />}
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </>
      )}
      {mcqs.length > 0 && (
        <>
          <Grid sm={12}>
            <Box display="flex" gap={2}>
              <Typography fontWeight={500}>MCQs</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Divider sx={{ width: "100%" }} />
              </Box>
            </Box>
          </Grid>
          <Grid sm={12}>
            <Stack spacing={2}>
              {Object.keys(groupedMCQs).map((group: string) => (
                <Stack spacing={2} key={group}>
                  <Box>
                    <Chip label={group} variant="outlined" />
                  </Box>
                  <Paper elevation={0} variant="outlined" sx={{ padding: 2 }}>
                    <Grid container spacing={3}>
                      {groupedMCQs[group].map(
                        (question: Question, index: number) => (
                          <Grid sm={12} key={question.uuid}>
                            <Stack gap={2}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography fontWeight={500}>
                                  Question {index + 1}
                                </Typography>
                                <Stack direction="row" gap={1}>
                                  <Chip
                                    label={`Difficulty: ${question.difficulty.name}`}
                                    variant="outlined"
                                  />
                                  <Chip
                                    label={`Score: ${question.points}`}
                                    variant="outlined"
                                  />
                                  <IconButton
                                    onClick={() =>
                                      onRegenerateClick(question.uuid)
                                    }
                                    disabled={
                                      Boolean(regenerateLoading) ||
                                      Boolean(editQuestionID)
                                    }
                                  >
                                    <ReloadIcon
                                      className={
                                        regenerateLoading === question.uuid
                                          ? "spinning"
                                          : ""
                                      }
                                      style={{ height: 16, width: 16 }}
                                    />
                                  </IconButton>
                                </Stack>
                              </Stack>
                              {editQuestionID === question.uuid ? (
                                <EditQuestionForm
                                  question={question}
                                  onCancel={() => {
                                    setEditQuestionID(null);
                                  }}
                                  onSubmit={onEditSubmit}
                                />
                              ) : (
                                <Markdown data={question.body} />
                              )}
                              <Stack gap={2}>
                                {question.options.map((option, index) => (
                                  <Box
                                    key={option.uuid}
                                    display="flex"
                                    gap={2}
                                    justifyContent="flex-start"
                                    alignItems="center"
                                  >
                                    <Chip
                                      label={index + 1}
                                      size="small"
                                      color={
                                        option.is_correct
                                          ? "primary"
                                          : "default"
                                      }
                                    />
                                    <Markdown data={option.body} />
                                  </Box>
                                ))}
                              </Stack>
                              {index !== groupedMCQs[group].length - 1 && (
                                <Divider />
                              )}
                            </Stack>
                          </Grid>
                        )
                      )}
                    </Grid>
                  </Paper>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </>
      )}
      {openEndedQuestions.length > 0 && (
        <Grid sm={12}>
          <Paper elevation={0} variant="outlined" sx={{ padding: 2 }}>
            <Grid container spacing={3}>
              <Grid sm={12}>
                <Markdown data={data?.base_question} />
              </Grid>
              {data?.questions.map((question, index) => (
                <Grid sm={12} key={question.uuid}>
                  <Divider />
                  <Stack gap={2} marginTop={2}>
                    <Typography fontWeight={500}>
                      Question {index + 1}
                    </Typography>
                    <Markdown data={question.body} />
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default Questions;
