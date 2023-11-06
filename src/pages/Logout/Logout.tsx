import { useEffect } from "react";

import { logout } from "src/calls/auth";
import Loader from "src/components/Loader/Loader";
import { useAppDispatch } from "src/redux/hooks";
import { FullContainer } from "src/styles";

const Logout = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(logout());
  }, []);
  return (
    <FullContainer>
      <Loader />
    </FullContainer>
  );
};

export default Logout;
