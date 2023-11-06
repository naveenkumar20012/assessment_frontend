import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PasswordResetForm from "src/forms/PasswordResetForm/PasswordResetForm";
import { MainLogo } from "src/utils/svgs";

const PasswordReset = () => {
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
      <MainLogo style={{ height: 60 }} />
      <Paper
        elevation={0}
        variant="outlined"
        sx={{ padding: "30px", width: { xs: "90%", sm: "500px" } }}
      >
        <PasswordResetForm />
      </Paper>
      <Box>
        <Typography color={(t) => t.palette.grey[500]} fontSize={15}>
          Know your password?{" "}
          <Link
            href="/auth/login"
            underline="hover"
            color={(t) => t.palette.primary.main}
          >
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default PasswordReset;
