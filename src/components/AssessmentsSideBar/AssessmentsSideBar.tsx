import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useAppDispatch } from "src/redux/hooks";
import { updateAssessmentCreationPopupState } from "src/redux/popupSlice";
import { SearchIcon } from "src/utils/svgs";

import { AssessmentsSideBarContainer } from "./AssessmentsSideBar.styles";
import { AssessmentsSideBarProps } from "./AssessmentsSideBar.types";

const AssessmentsSideBar: React.FC<AssessmentsSideBarProps> = (props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState("");
  const { setSearch, setAssessmentType, assessmentType } = props;
  useEffect(() => {
    if (!localSearch) {
      setSearch(localSearch);
    }
  }, [localSearch]);
  const create = () => {
    dispatch(
      updateAssessmentCreationPopupState({
        isAssessmentCreationPopupOpen: true,
        assessmentCreationPopupProps: {},
      })
    );
  };
  return (
    <AssessmentsSideBarContainer elevation={0} variant="outlined">
      <Stack spacing={3} sx={{ width: "100%" }}>
        <Button
          onClick={create}
          color="primary"
          variant="contained"
          sx={{ marginBottom: 1 }}
        >
          Create new assessment
        </Button>
        <Divider />
        <FormControl>
          <Typography
            mb={2}
            fontWeight={500}
            color={(t) => t.palette.grey[600]}
          >
            Filters
          </Typography>
          <RadioGroup
            value={assessmentType}
            onChange={(e) => {
              navigate(`#${e.target.value}`);
              setAssessmentType(e.target.value as AssessmetType);
            }}
          >
            <FormControlLabel
              value="TECHNICAL"
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 18,
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: 14 }}>
                  Technical Assessments
                </Typography>
              }
            />
            <FormControlLabel
              value="NON_TECHNICAL"
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 18,
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: 14 }}>
                  Case Study Assessments
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>
        {/* <TextField
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search"
          variant="outlined"
          size="small"
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              setSearch(localSearch);
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => {
                  setSearch(localSearch);
                }}
              >
                <SearchIcon />
              </IconButton>
            ),
          }}
        /> */}
      </Stack>
    </AssessmentsSideBarContainer>
  );
};

export default AssessmentsSideBar;
