import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Fade from "@mui/material/Fade";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import NonTechnicalAssessmentsForm from "src/forms/NonTechnicalAssessmentsForm/NonTechnicalAssessmentsForm";
import TechnicalAssessmentForm from "src/forms/TechnicalAssessmentForm/TechnicalAssessmentForm";
import { useAppDispatch } from "src/redux/hooks";
import { updateAssessmentCreationPopupState } from "src/redux/popupSlice";
import {
  CrossIcon,
  NonTechnicalAssessmentIcon,
  TechnicalAssessmentIcon,
} from "src/utils/svgs";

import { AssessmentSelectionProps } from "./CreateAssessment.types";

const AssessmentSelection: React.FC<AssessmentSelectionProps> = (props) => {
  const { setAssessmentType } = props;
  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={5}
      padding="100px 50px"
    >
      <Button
        onClick={() => setAssessmentType("TECHNICAL")}
        variant="outlined"
        sx={{
          borderColor: (t) => t.palette.grey[300],
          color: (t) => t.palette.text.primary,
          transition: "all 250ms ease-in",
        }}
      >
        <Stack
          width="200px"
          height="200px"
          alignItems="center"
          justifyContent="center"
          paddingY={5}
          gap={2}
        >
          <TechnicalAssessmentIcon />
          <Typography fontSize={14}>Technical</Typography>
        </Stack>
      </Button>
      <Button
        onClick={() => setAssessmentType("NON_TECHNICAL")}
        variant="outlined"
        sx={{
          borderColor: (t) => t.palette.grey[300],
          color: (t) => t.palette.text.primary,
          transition: "all 250ms ease-in",
        }}
      >
        <Stack
          width="200px"
          height="200px"
          alignItems="center"
          justifyContent="center"
          paddingY={5}
          gap={2}
        >
          <NonTechnicalAssessmentIcon />
          <Typography fontSize={14}>Case Study</Typography>
        </Stack>
      </Button>
    </Box>
  );
};

const CreateAssessment = () => {
  const dispatch = useAppDispatch();
  const [assessmentType, setAssessmentType] = useState<AssessmetType>("");
  const onClose = () => {
    dispatch(
      updateAssessmentCreationPopupState({
        isAssessmentCreationPopupOpen: false,
        assessmentCreationPopupProps: {},
      })
    );
  };
  return (
    <Dialog
      open={true}
      closeAfterTransition
      disableAutoFocus
      fullWidth
      scroll="body"
    >
      <Fade in timeout={1000}>
        <Box>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            padding="10px 10px 10px 20px"
            borderBottom={(t) => `thin solid ${t.palette.divider}`}
          >
            <Grid>
              <Typography fontWeight={500} fontSize={18}>
                Create new assessment
              </Typography>
            </Grid>
            <Grid>
              <Button onClick={onClose} color="inherit">
                <CrossIcon />
              </Button>
            </Grid>
          </Grid>
          {assessmentType === "" && (
            <AssessmentSelection
              assessmentType={assessmentType}
              setAssessmentType={setAssessmentType}
            />
          )}
          {assessmentType === "TECHNICAL" && (
            <TechnicalAssessmentForm onClose={onClose} />
          )}
          {assessmentType === "NON_TECHNICAL" && (
            <NonTechnicalAssessmentsForm onClose={onClose} />
          )}
        </Box>
      </Fade>
    </Dialog>
  );
};

export default CreateAssessment;
