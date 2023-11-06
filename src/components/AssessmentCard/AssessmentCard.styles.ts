import { styled } from "@mui/system";

export const AssessmentCardContainer = styled("div")(({ theme }) => ({
  border: `thin solid ${theme.palette.grey[300]}`,
  padding: 20,
  borderRadius: 5,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  cursor: "pointer",
}));
