import { Divider, Paper, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/system/Unstable_Grid";
import { useAppSelector } from "src/redux/hooks";

const commonStyles = {
  height: "100%",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  padding: 4,
  gap: 2,
};

const Usage = () => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <Box padding="20px" width="100%" height="100%">
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Typography fontWeight={500} fontSize={18}>
            Plan & Usage
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </Grid>
        <Grid xs={12}>
          <Grid container spacing={2}>
            <Grid xs={4}>
              <Paper elevation={0} variant="outlined">
                <Stack {...commonStyles}>
                  <Typography
                    color={(t) => t.palette.grey[500]}
                    fontWeight={500}
                  >
                    Total
                  </Typography>
                  <Typography>{user.company.credits.total}</Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid xs={4}>
              <Paper elevation={0} variant="outlined">
                <Stack {...commonStyles}>
                  <Typography
                    color={(t) => t.palette.grey[500]}
                    fontWeight={500}
                  >
                    Available
                  </Typography>
                  <Typography>{user.company.credits.available}</Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid xs={4}>
              <Paper elevation={0} variant="outlined">
                <Stack {...commonStyles}>
                  <Typography
                    color={(t) => t.palette.grey[500]}
                    fontWeight={500}
                  >
                    Used
                  </Typography>
                  <Typography>{user.company.credits.used}</Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Usage;
