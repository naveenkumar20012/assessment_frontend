import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getInitialDetailsWithToken } from "src/calls/auth";
import Loader from "src/components/Loader/Loader";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";

const InternalLogin = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useAppDispatch();
  const { internalDataLoaded } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      dispatch(getInitialDetailsWithToken(token));
    }
  }, []);
  useEffect(() => {
    if (internalDataLoaded) {
      navigate("/", { replace: true });
    }
  }, [internalDataLoaded]);
  return <Loader />;
};

export default InternalLogin;
