import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import PasswordResetConfirmForm from "src/forms/PasswordResetConfirmForm/PasswordResetConfirmForm";
import { MainLogo } from "src/utils/svgs";

const PasswordResetConfirm = () => {
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
        <PasswordResetConfirmForm />
      </Paper>
    </Box>
  );
};

export default PasswordResetConfirm;
