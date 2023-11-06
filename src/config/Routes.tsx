import { useEffect } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { getInitialDetails } from "src/calls/auth";
import Loader from "src/components/Loader/Loader";
import AuthRoot from "src/components/Root/AuthRoot";
import RespondentRoot from "src/components/Root/RespondentRoot";
import Root from "src/components/Root/Root";
import AssessmentSubmitted from "src/pages/AssessmentSubmitted/AssessmentSubmitted";
import Assessment from "src/pages/Assessments/Assessments";
import Dashboard from "src/pages/Dashboard/Dashboard";
import InternalLogin from "src/pages/InternalLogin/InternalLogin";
import Invite from "src/pages/Invite/Invite";
import InviteInvalid from "src/pages/InviteInvalid/InviteInvalid";
import Login from "src/pages/Login/Login";
import Logout from "src/pages/Logout/Logout";
import PasswordReset from "src/pages/PasswordReset/PasswordReset";
import PasswordResetConfirm from "src/pages/PasswordResetConfirm/PasswordResetConfirm";
import RespondentAssessment from "src/pages/RespondentAssessment/RespondentAssessment";
import RespondentDetails from "src/pages/RespondentDetails/RespondentDetails";
import Settings from "src/pages/Settings/Settings";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/internal",
        children: [
          {
            path: "login",
            element: <InternalLogin />,
          },
        ],
      },
      {
        path: "/auth",
        element: <AuthRoot />,
        children: [
          {
            path: "login",
            element: <Login />,
          },

          {
            path: "password/reset",
            element: <PasswordReset />,
          },
          {
            path: "password/reset/confirm",
            element: <PasswordResetConfirm />,
          },
        ],
      },
      {
        path: "/",
        element: <Root />,
        children: [
          {
            index: true,
            element: <Navigate to="assessments" replace />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "assessments",
            children: [
              {
                index: true,
                element: <Assessment />,
              },
              {
                path: ":assessmentID",
                element: <Invite />,
              },
            ],
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "logout",
            element: <Logout />,
          },
        ],
      },
      {
        path: "/invite/:inviteID",
        element: <RespondentRoot />,
        children: [
          {
            index: true,
            element: <RespondentDetails />,
          },
          {
            path: "invalid",
            element: <InviteInvalid />,
          },
          {
            path: "assessment",
            element: <RespondentAssessment />,
          },
          {
            path: "submited",
            element: <AssessmentSubmitted />,
          },
        ],
      },
    ],
  },
]);

const Routes = () => {
  const { initialDataLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getInitialDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (initialDataLoading) {
    return <Loader />;
  }
  return <RouterProvider router={router} />;
};

export default Routes;
