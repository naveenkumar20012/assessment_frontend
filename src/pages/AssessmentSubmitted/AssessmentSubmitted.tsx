import { Box, Divider, Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PoweredBy from "src/components/PoweredBy/PoweredBy";
import FeedbackForm from "src/forms/FeedbackForm/FeedbackForm";
import { useAppSelector } from "src/redux/hooks";
import { ConformationTickIcon, PyjamaHRIcon, ShortLogo } from "src/utils/svgs";

const AssessmentSubmitted = () => {
  const { assessment_name, uuid, is_ats } = useAppSelector(
    (state) => state.respondent
  );
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
      }}
    >
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
      </Paper>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        width="100%"
        height="calc(100% - 64px)"
        gap={5}
        position="relative"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={2}
        >
          <ConformationTickIcon />
          <Typography fontSize={16} fontWeight={500}>
            Your assessment is submitted successfully
          </Typography>
          <Typography fontSize={14} fontWeight={500}>
            Someone will get in touch with you after reviewing your submission
          </Typography>
        </Box>
        <Paper elevation={0} variant="outlined">
          <FeedbackForm invite={uuid} />
        </Paper>
        <Box position="absolute" bottom={10}>
          <PoweredBy />
        </Box>
      </Box>
    </Box>
  );
};

export default AssessmentSubmitted;
