import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import LoginForm from "src/forms/LoginForm/LoginForm";
import { MainLogo } from "src/utils/svgs";

const platform: Platform = window.location.href.includes("pyjamahr")
  ? "pyjamahr"
  : "hackergenius";

const Login = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      width="100%"
      height="100%"
      gap={3}
    >
      {platform === "pyjamahr" ? <></> : <MainLogo style={{ height: 60 }} />}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{ padding: "30px", width: { xs: "90%", sm: "500px" } }}
      >
        <LoginForm />
      </Paper>
    </Box>
  );
};

export default Login;
