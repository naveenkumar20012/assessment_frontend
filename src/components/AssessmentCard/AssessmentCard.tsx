import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { localDateTime } from "src/utils/common";

import { AssessmentCardProps } from "./AssessmentCard.types";

const AssessmentCard: React.FC<AssessmentCardProps> = (props) => {
  const { assessment } = props;
  const navigate = useNavigate();
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        cursor: "pointer",
        transition: "all 250ms ease-in",
        "&:hover": { borderColor: (t) => t.palette.primary.main },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
      variant="outlined"
      onClick={() => {
        navigate(`/assessments/${assessment.uuid}`);
      }}
    >
      <Grid container spacing={1}>
        <Grid xs={12}>
          <Typography fontWeight={500} fontSize={18}>
            {assessment.name}
          </Typography>
        </Grid>
        <Grid xs={12} display="flex" flexDirection="row" gap={1} fontSize={14}>
          <Box>Test duration: {assessment.duration}</Box>
          <Divider orientation="vertical" flexItem />
          <Box>Invited: {assessment.invites}</Box>
          <Divider orientation="vertical" flexItem />
          <Box>Taken: {assessment.taken}</Box>
        </Grid>
        <Grid xs={12} display="flex" flexDirection="row" gap={1} fontSize={14}>
          <Box>Created on: {localDateTime(assessment.created_at)}</Box>
          <Divider orientation="vertical" flexItem />
          <Box>Created by: {assessment.creator}</Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AssessmentCard;
