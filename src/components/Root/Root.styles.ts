import { styled } from "@mui/material";

export const FullContainerColumn = styled("div")({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const ContentContainer = styled("div")({
  height: "calc(100% - 64px)",
  width: "100%",
  padding: "20px 24px",
  overflow: "scroll",
});

export const ContentContainerMaxSpace = styled("div")({
  height: "calc(100% - 64px)",
  width: "100%",
  padding: 10,
});
