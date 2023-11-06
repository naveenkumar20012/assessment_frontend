import { Box, Typography } from "@mui/material";
import { useAppSelector } from "src/redux/hooks";
import { BrandIcon, MainLogo } from "src/utils/svgs";

const PoweredBy = () => {
  const { is_ats } = useAppSelector((state) => state.respondent);
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography
        fontSize={16}
        color={(t) => t.palette.grey[600]}
        fontWeight={400}
      >
        Powered by
      </Typography>
      {is_ats ? <BrandIcon /> : <MainLogo style={{ height: 40, width: 150 }} />}
    </Box>
  );
};

export default PoweredBy;
