import { useEffect, useState } from "react";

import { Typography } from "@mui/material";
import { formatCountDownTimer } from "src/utils/formatters";

import { CountdownTimerProps } from "./CountdownTimer.types";

const CountdownTimer: React.FC<CountdownTimerProps> = (props) => {
  const { duration, forceSubmit } = props;
  const [time, setTime] = useState(duration * 60);

  useEffect(() => {
    if (!time) {
      forceSubmit();
      return;
    }
    const timer = setInterval(
      () => setTime((prevState) => prevState - 1),
      1000
    );
    return () => clearInterval(timer);
  }, [time]);

  return (
    <Typography fontWeight={500}>
      Time remaining : {formatCountDownTimer(time)}
    </Typography>
  );
};

export default CountdownTimer;
