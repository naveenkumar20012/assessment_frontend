import { Navigate, Outlet } from "react-router-dom";

import { Fade } from "@mui/material";
import { useAppSelector } from "src/redux/hooks";

import BaseRoot from "./BaseRoot";
import { FullContainerColumn } from "./Root.styles";

const AuthRoot = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <Fade in timeout={1000}>
      <FullContainerColumn className="pattern">
        <BaseRoot />
        <Outlet />
      </FullContainerColumn>
    </Fade>
  );
};

export default AuthRoot;
