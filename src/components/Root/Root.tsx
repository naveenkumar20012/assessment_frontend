import { Navigate, Outlet } from "react-router-dom";

import Fade from "@mui/material/Fade";
import Navbar from "src/components/Navbar/Navbar";
import { useAppSelector } from "src/redux/hooks";

import BaseRoot from "./BaseRoot";
import { ContentContainer, FullContainerColumn } from "./Root.styles";

const Root = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return (
    <FullContainerColumn>
      <Navbar />
      <BaseRoot />
      <Fade in timeout={1000}>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </Fade>
    </FullContainerColumn>
  );
};

export default Root;
