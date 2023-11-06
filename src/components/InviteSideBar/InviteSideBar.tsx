import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { InviteSideBarContainer } from "./InviteSideBar.styles";
import { InviteSideBarProps } from "./InviteSideBar.types";

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 100,
    label: "100",
  },
];

const InviteSideBar: React.FC<InviteSideBarProps> = (props) => {
  const { handleChangeScore, scoreRange } = props;
  return (
    <InviteSideBarContainer elevation={0} variant="outlined">
      <Stack spacing={3} sx={{ width: "100%" }}>
        <Stack gap={1}>
          <Typography fontSize={14} fontWeight={500} textAlign="left">
            Score
          </Typography>
          <Box justifyContent="center" alignItems="center" display="flex">
            <Slider
              getAriaLabel={() => "Score range"}
              value={scoreRange}
              onChange={handleChangeScore}
              valueLabelDisplay="auto"
              marks={marks}
              sx={{ width: "230px" }}
            />
          </Box>
        </Stack>
      </Stack>
    </InviteSideBarContainer>
  );
};

export default InviteSideBar;
