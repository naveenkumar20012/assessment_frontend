import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import {
  getSkillLevel,
  getSkillName,
  getSkillQuestionsCount,
  getSkillScore,
  getSkillType,
} from "src/forms/TechnicalAssessmentForm/helpers";
import { useAppSelector } from "src/redux/hooks";
import { FalseIcon, TrueIcon } from "src/utils/svgs";

import Questions from "../Questions/Questions";
import { InviteOverviewProps } from "./InviteOverview.types";

const InviteOverview: React.FC<InviteOverviewProps> = (props) => {
  const { assessment, skills, difficulties } = props;
  const { matrix } = useAppSelector((state) => state.auth.user.company);
  const config = assessment?.config;
  const commonStyles = {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    gap: 2,
  };
  return (
    <Grid container gap={3} width="100%">
      <Grid xs={12}>
        <Grid container spacing={2}>
          <Grid xs={3}>
            <Paper elevation={0} variant="outlined">
              <Stack {...commonStyles}>
                <Typography color={(t) => t.palette.grey[500]} fontWeight={500}>
                  Invited
                </Typography>
                <Typography>{assessment?.invites}</Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid xs={3}>
            <Paper elevation={0} variant="outlined">
              <Stack {...commonStyles}>
                <Typography color={(t) => t.palette.grey[500]} fontWeight={500}>
                  Taken
                </Typography>
                <Typography>{assessment?.taken}</Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid xs={3}>
            <Paper elevation={0} variant="outlined">
              <Stack {...commonStyles}>
                <Typography color={(t) => t.palette.grey[500]} fontWeight={500}>
                  Pending
                </Typography>
                <Typography>{assessment?.pending}</Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid xs={3}>
            <Paper elevation={0} variant="outlined">
              <Stack {...commonStyles}>
                <Typography color={(t) => t.palette.grey[500]} fontWeight={500}>
                  Expired
                </Typography>
                <Typography>{assessment?.expired}</Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={assessment?.restricted_languages ? 6 : 12}>
        <Paper elevation={0} variant="outlined">
          <Stack gap={3} padding={2}>
            <Typography fontWeight={500}>Security</Typography>
            <Grid container gap={3}>
              <Grid xs={5}>
                <Stack gap={1} direction="row" alignItems="center">
                  {assessment?.is_tab_switches_enabled ? (
                    <TrueIcon />
                  ) : (
                    <FalseIcon />
                  )}
                  <Typography fontSize={14} fontWeight={500}>
                    Enable tab switch check
                  </Typography>
                </Stack>
              </Grid>
              <Grid xs={5}>
                <Stack gap={1} direction="row" alignItems="center">
                  {assessment?.is_fullscreen_exits_enabled ? (
                    <TrueIcon />
                  ) : (
                    <FalseIcon />
                  )}
                  <Typography fontSize={14} fontWeight={500}>
                    Enable fullscreen exits check
                  </Typography>
                </Stack>
              </Grid>
              <Grid xs={5}>
                <Stack gap={1} direction="row" alignItems="center">
                  {assessment?.is_shuffling_enabled ? (
                    <TrueIcon />
                  ) : (
                    <FalseIcon />
                  )}
                  <Typography fontSize={14} fontWeight={500}>
                    Enable question shuffling
                  </Typography>
                </Stack>
              </Grid>
              <Grid xs={5}>
                <Stack gap={1} direction="row" alignItems="center">
                  {assessment?.is_proctoring_enabled ? (
                    <TrueIcon />
                  ) : (
                    <FalseIcon />
                  )}
                  <Typography fontSize={14} fontWeight={500}>
                    Enable proctoring
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      </Grid>
      {assessment?.restricted_languages && (
        <Grid xs={5}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ height: "100%", width: "100%" }}
          >
            <Stack gap={3} padding={2}>
              <Typography fontWeight={500}>
                Restricted programming language
              </Typography>
              <Typography>
                {assessment?.restricted_languages.join(", ")}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      )}
      {Boolean(config) && (
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
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(config).map((skill) => (
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
                      {getSkillLevel(skill, config, difficulties)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {getSkillType(skill, skills)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {getSkillQuestionsCount(skill, config)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {getSkillScore(
                        skill,
                        config,
                        skills,
                        difficulties,
                        matrix
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
      <Grid xs={12}>
        <Questions assessmentID={assessment?.uuid} />
      </Grid>
    </Grid>
  );
};

export default InviteOverview;
