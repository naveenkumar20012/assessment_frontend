import { styled } from "@mui/system";

export const SuccessCode = styled("pre")(({ theme }) => ({
  color: theme.palette.success.main,
}));

export const ErrorCode = styled("pre")(({ theme }) => ({
  color: theme.palette.error.main,
}));
