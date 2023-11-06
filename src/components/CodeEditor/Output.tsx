import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { ErrorCode, SuccessCode } from "./CodeEditor.styles";

const Output = ({ outputDetails }: any) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;
    if (statusId === 6) {
      // compilation error
      return <ErrorCode>{atob(outputDetails?.compile_output)}</ErrorCode>;
    } else if (statusId === 3) {
      return (
        <SuccessCode>
          {atob(outputDetails.stdout) !== null
            ? `${atob(outputDetails.stdout)}`
            : null}
        </SuccessCode>
      );
    } else if (statusId === 5) {
      return <ErrorCode>{`Time Limit Exceeded`}</ErrorCode>;
    } else {
      return (
        <ErrorCode>
          {outputDetails?.stderr ? atob(outputDetails?.stderr) : ""}
        </ErrorCode>
      );
    }
  };
  return (
    <Grid container spacing={1}>
      <Grid xs={12} gap={2} display="flex">
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Status: {outputDetails?.status?.description || "-"}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Memory: {outputDetails?.memory || "-"}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Time: {outputDetails?.time || "-"}
        </Typography>
      </Grid>
      <Grid xs={12}>{outputDetails ? getOutput() : <></>}</Grid>
    </Grid>
  );
};

export default Output;
