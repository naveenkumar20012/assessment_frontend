import { VirtuosoGrid } from "react-virtuoso";

import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FullContainer } from "src/styles";
import { urlFormatter } from "src/utils/formatters";
import { usePaginatedAPI } from "src/utils/hooks";
import { ZeroScreen } from "src/utils/svgs";
import { ASSESSMENTS_URL } from "src/utils/urls";

import AssessmentCard from "../AssessmentCard/AssessmentCard";
import Loader from "../Loader/Loader";
import { AssessmentListItem } from "./AssessmentsList.styles";
import { AssessmentsListProps } from "./AssessmentsList.types";

const LIMIT = 20;

const AssessmentsList: React.FC<AssessmentsListProps> = (props) => {
  const { filterQS } = props;
  const formattedURL = urlFormatter(ASSESSMENTS_URL, filterQS);
  const { data, loading, nextPage } = usePaginatedAPI(formattedURL, LIMIT);
  const assessmentData = data as Array<Assessment>;
  const Footer = () => {
    return loading ? <CircularProgress /> : <></>;
  };
  if (!assessmentData.length && loading) {
    return <Loader />;
  }
  if (!assessmentData.length && !loading) {
    return (
      <FullContainer>
        <Stack gap={5} alignContent="center" justifyContent="center">
          <ZeroScreen style={{ height: 200, width: 200 }} />
          <Typography color={(t) => t.palette.grey[500]} textAlign="center">
            No assessments available
          </Typography>
        </Stack>
      </FullContainer>
    );
  }
  return (
    <VirtuosoGrid
      style={{
        height: "100%",
        width: "100%",
      }}
      listClassName="grid-list"
      totalCount={assessmentData.length}
      overscan={20}
      endReached={() => {
        nextPage();
      }}
      itemContent={(index) => (
        <AssessmentCard assessment={assessmentData[index]} key={index} />
      )}
      components={{
        Item: AssessmentListItem,
        Footer,
      }}
    />
  );
};

export default AssessmentsList;
