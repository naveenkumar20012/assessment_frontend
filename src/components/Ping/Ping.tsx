import { useEffect } from "react";

import { ping } from "src/calls/respondent";

import { PingProps } from "./Ping.types";

const MINUTE_MS = 60000;

const Ping: React.FC<PingProps> = (props) => {
  useEffect(() => {
    const interval = setInterval(() => {
      ping(props.inviteID);
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  return <></>;
};

export default Ping;
