import { styled } from "@mui/material";
import Box from "@mui/material/Box";

export const QuestionsBox = styled(Box)(({ theme }) => ({
  borderRadius: 5,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  background: theme.palette.background.paper,
  width: "90%",
  height: "90%",
  [theme.breakpoints.down("sm")]: {
    width: "98%",
  },
}));
