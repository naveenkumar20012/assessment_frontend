import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";

import {
  Box,
  Button,
  Checkbox,
  FormHelperText,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import screenfull from "screenfull";
import {
  getAssessmentCandidateBasicDetails,
  startAssessment,
} from "src/calls/respondent";
import Loader from "src/components/Loader/Loader";
import PoweredBy from "src/components/PoweredBy/PoweredBy";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { handleError } from "src/utils/common";

import { RespondentDetailsFormProps } from "./RespondentDetails.types";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const RespondentDetails = () => {
  const { inviteID } = useParams();
  const navigate = useNavigate();
  const {
    respondentLoading,
    is_started,
    is_submitted,
    is_revoked,
    is_expired,
    email,
    assessment_name,
    company_name,
    questions,
    name,
    assessment_duration,
    inviteNotFound,
    ats_company_name,
    is_proctoring_enabled,
  } = useAppSelector((state) => state.respondent);
  const dispatch = useAppDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const form = useForm<RespondentDetailsFormProps>();
  useEffect(() => {
    dispatch(getAssessmentCandidateBasicDetails(inviteID || ""));
  }, []);
  const requestAccess = () => {
    setLoadingVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setVideoAvailable(true);
        setLoadingVideo(false);
      })
      .catch(() => {
        toast.error("Please provide required permissions");
      });
  };
  const onStartAssessment = () => {
    if (screenfull.isEnabled) {
      screenfull.request();
      setFormLoading(true);
      startAssessment(inviteID || "")
        .then(() => {
          navigate("assessment", { replace: true });
        })
        .catch((err) => {
          handleError(err);
        })
        .finally(() => {
          setFormLoading(false);
        });
    } else {
      toast.error("Please enable full screen support");
    }
  };
  if (respondentLoading) {
    return <Loader />;
  }
  if (is_revoked || is_submitted || inviteNotFound || is_expired) {
    return (
      <Navigate
        to="invalid"
        replace
        state={{
          message: is_revoked
            ? "This invite is no longer valid"
            : is_submitted
            ? "Assessment already submitted"
            : is_expired
            ? "Invite has expired"
            : "Invite not found",
        }}
      />
    );
  }
  return (
    <Grid container height="100%">
      <Grid xs={12} md={5}>
        <Stack
          justifyContent="space-between"
          height="100%"
          padding="40px"
          sx={{ background: (t) => t.palette.background.paper }}
          spacing={10}
        >
          <Box>
            {ats_company_name ? (
              <Typography
                variant="h5"
                fontSize={24}
                fontWeight={500}
                color="primary"
              >
                {ats_company_name}
              </Typography>
            ) : (
              <Typography
                variant="h5"
                fontSize={24}
                fontWeight={500}
                color="primary"
              >
                {company_name}
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={3} flexDirection="column">
            <Typography
              fontSize={18}
              color={(t) => t.palette.grey[700]}
              fontWeight={500}
            >
              👋 Welcome {name ? name : email}
            </Typography>
            <Box display="flex" gap={1} flexDirection="column">
              <Typography color="text.secondary">Assessment name</Typography>
              <Typography fontSize={24} fontWeight={500}>
                {assessment_name}
              </Typography>
            </Box>
            <Box display="flex" gap={5} flexDirection="row">
              <Box display="flex" gap={1} flexDirection="column">
                <Typography color="text.secondary">No. of Questions</Typography>
                <Typography>{questions} questions</Typography>
              </Box>
              <Box display="flex" gap={1} flexDirection="column">
                <Typography color="text.secondary">
                  Assessment duration
                </Typography>
                <Typography>{assessment_duration} minutes</Typography>
              </Box>
            </Box>
          </Box>
          <PoweredBy />
        </Stack>
      </Grid>
      <Grid xs={12} md={7}>
        <Stack
          height="100%"
          padding="40px"
          spacing={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {is_proctoring_enabled && (
            <Box height={200} width={200}>
              {videoAvailable ? (
                <Webcam
                  audio={false}
                  videoConstraints={videoConstraints}
                  height={"100%"}
                  width={"100%"}
                />
              ) : (
                <Box
                  sx={{
                    border: (t) => `thin solid ${t.palette.grey[400]}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 5,
                    textAlign: "center",
                  }}
                >
                  <Typography>
                    {loadingVideo ? "Loading video" : "Video not available"}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          <Box>
            <Typography fontWeight={500}>Instructions</Typography>
            <ol>
              <li>
                Please ensure that you take the test in a location with a good
                internet connection.
              </li>
              <li>
                This is a timed assessment. Please make sure you are not
                interrupted during the assessment, as the timer cannot be paused
                once started.
              </li>
              <li>
                Please note that you will not be able to exit full screen mode
                during the test. If you attempt to exit more than three times,
                your test will end and it will be automatically submitted.
              </li>
              <li>
                To ensure the integrity of the test, you will not be allowed to
                switch between tabs and windows. If you attempt to do so more
                than three times, your test will end and it will be
                automatically submitted.
              </li>
              <li>
                We kindly request that you do not use any AI platforms, such as
                ChatGPT, to generate answers. This is considered plagiarism and
                will be detected during the test.
              </li>
              <li>
                Please refrain from copying and pasting any data during the
                test.
              </li>
            </ol>
          </Box>
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography fontWeight={500}>Declaration Statement</Typography>
            <Box
              component="form"
              onSubmit={form.handleSubmit(onStartAssessment)}
              display="flex"
              flexDirection="column"
              gap={2}
            >
              <Controller
                name="declaration"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <Stack
                    flexDirection="row"
                    alignItems="flex-start"
                    gap={2}
                    justifyContent="flex-start"
                  >
                    <Checkbox
                      checked={value || false}
                      onChange={(_, updatedValue) => onChange(updatedValue)}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 18,
                        },
                      }}
                    />
                    <Typography>
                      I agree not to copy code from any source, including
                      websites, books, or colleagues. I may refer to language
                      documentation or an IDE of my choice. I agree not to copy
                      or share PyjamaHR’s copyrighted assessment content or
                      questions on any website or forum.
                    </Typography>
                  </Stack>
                )}
                rules={{ required: "This field is required" }}
              />
              <FormHelperText sx={{ color: (t) => t.palette.error.main }}>
                {form.formState.errors.declaration
                  ? "This field is required"
                  : ""}
              </FormHelperText>
              {videoAvailable || !is_proctoring_enabled ? (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formLoading}
                >
                  {is_started ? "Continue assessment" : "Start assessment"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={requestAccess}
                  disabled={loadingVideo}
                >
                  Provide access to camera
                </Button>
              )}
            </Box>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default RespondentDetails;
