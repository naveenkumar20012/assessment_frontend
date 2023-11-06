import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { assessmentReport } from "src/calls/assessments";
import InviteOverview from "src/components/InviteOverview/InviteOverview";
import InviteSideBar from "src/components/InviteSideBar/InviteSideBar";
import InviteTable from "src/components/InviteTable/InviteTable";
import Loader from "src/components/Loader/Loader";
import SmallLoader from "src/components/Loader/SmallLoader";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { updateInviteCandiadtePopupState } from "src/redux/popupSlice";
import { FullContainer, SideBar } from "src/styles";
import { useAPI } from "src/utils/hooks";
import { ASSESSMENTS_URL, DIFFICULTIES_URL, SKILLS_URL } from "src/utils/urls";

import { InvitesContainer } from "./Invite.styles";

type Screen = "#OVERVIEW" | "#REPORTS";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Invite = () => {
  const { assessmentID } = useParams();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(hash === "#REPORT" ? 1 : 0);
  const [scoreRange, setScoreRange] = useState<number[]>([0, 100]);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  useEffect(() => {
    if (!hash) {
      navigate("#OVERVIEW");
    }
  }, []);
  const handleChangeScore = (event: Event, newValue: number | number[]) => {
    setScoreRange(newValue as number[]);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(newValue === 1 ? "#REPORT" : "#OVERVIEW");
    setValue(newValue);
  };
  const { additionCount } = useAppSelector((state) => state.popup);
  const { data, loading, setData } = useAPI<Assessment>(
    `${ASSESSMENTS_URL}${assessmentID}/`
  );
  const { data: skills, loading: isSkillsLoading } =
    useAPI<Skill[]>(SKILLS_URL);
  const { data: difficulties, loading: isDifficultiesLoading } =
    useAPI<Difficulty[]>(DIFFICULTIES_URL);
  const create = () => {
    dispatch(
      updateInviteCandiadtePopupState({
        isInviteCandidatePopupOpen: true,
        inviteCandidatePopupProps: {
          assessmentID: assessmentID || "",
          callback: (count) =>
            setData({
              ...data,
              invites: data.invites + count,
              pending: data.pending + count,
            }),
        },
      })
    );
  };
  const onDownloadAssessmentReportClick = () => {
    setIsDownloadingReport(true);
    assessmentReport(assessmentID || "")
      .then(() => {
        toast.success("Report downloaded successfully");
      })
      .catch(() => {
        toast.error("Could not download report");
      })
      .finally(() => {
        setIsDownloadingReport(false);
      });
  };
  if (loading || isSkillsLoading || isDifficultiesLoading) {
    return <Loader />;
  }
  return (
    <Grid container gap={2} height="100%">
      <Grid xs={12} height="75px" display="flex" alignItems="center">
        <Paper
          elevation={0}
          variant="outlined"
          sx={{ p: 2, width: "100%", display: "flex", flexDirection: "row" }}
        >
          <Typography fontWeight={500} fontSize={18}>
            {data?.name}
          </Typography>
          <Grid container sx={{ ml: "auto" }} alignItems="baseline">
            <Typography variant="body1">{`Duration:`}</Typography>
            <Typography variant="caption">
              &nbsp;{`${data?.duration} minutes`}
            </Typography>
          </Grid>
        </Paper>
      </Grid>
      <Grid xs={12} height="50px" display="flex" alignItems="center">
        <Stack
          direction="row"
          gap={2}
          justifyContent="space-between"
          width="100%"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Reports" {...a11yProps(1)} />
          </Tabs>
          <Stack direction="row" gap={1}>
            <Button
              onClick={onDownloadAssessmentReportClick}
              color="primary"
              variant="outlined"
              disabled={isDownloadingReport}
            >
              {isDownloadingReport ? <SmallLoader /> : "Download Report"}
            </Button>
            <Button onClick={create} color="primary" variant="contained">
              Invite Candidates
            </Button>
          </Stack>
        </Stack>
      </Grid>
      <Grid xs={12} display="flex" height="calc(100% - 160px)" width="100%">
        {value === 0 && (
          <InviteOverview
            assessment={data}
            skills={skills}
            difficulties={difficulties}
          />
        )}
        {value === 1 && (
          <FullContainer>
            <SideBar>
              <InviteSideBar
                setSearch={setSearch}
                scoreRange={scoreRange}
                handleChangeScore={handleChangeScore}
                search={search}
              />
            </SideBar>
            <InvitesContainer>
              <InviteTable
                assessmentID={assessmentID || ""}
                search={search}
                scoreRange={scoreRange}
                key={`${additionCount}`}
                assessment={data}
              />
            </InvitesContainer>
          </FullContainer>
        )}
      </Grid>
    </Grid>
  );
};

export default Invite;
