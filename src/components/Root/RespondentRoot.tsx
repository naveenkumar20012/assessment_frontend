import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "src/redux/hooks";

import BaseRoot from "./BaseRoot";
import { FullContainerColumn } from "./Root.styles";

const RespondentRoot = () => {
  const { isRespontentDataLoaded } = useAppSelector(
    (state) => state.respondent
  );
  const location = useLocation();
  if (
    !isRespontentDataLoaded &&
    (location.pathname.includes("assessment") ||
      location.pathname.includes("submited"))
  ) {
    return <Navigate to="./" replace />;
  }
  return (
    <FullContainerColumn>
      <BaseRoot />
      <Outlet />
    </FullContainerColumn>
  );
};

export default RespondentRoot;
