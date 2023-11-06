import { styled } from "@mui/material";

export const FullContainer = styled("div")({
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const SideBar = styled("div")({
  width: 300,
  height: "100%",
});

export const FullContainerWithSideBar = styled("div")({
  width: "calc(100% - 300px)",
  height: "100%",
});
