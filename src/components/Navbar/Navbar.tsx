import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Divider, Stack, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import { useAppSelector } from "src/redux/hooks";
import { ShortLogo } from "src/utils/svgs";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        height: 64,
      }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Box sx={{ flexGrow: 1 }} alignItems="center" display="flex">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            onClick={() => navigate("/assessments")}
            sx={{ cursor: "pointer" }}
          >
            <ShortLogo style={{ height: 40, width: 40 }} />
            <Divider orientation="vertical" variant="middle" flexItem />
            <Typography
              variant="h6"
              sx={{ color: (t) => t.palette.grey[800], fontWeight: 500 }}
            >
              {user.company.name}
            </Typography>
          </Stack>
        </Box>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Box
            sx={{
              textTransform: "none",
              display: "flex",
              mr: 2,
              gap: 0.75,
              color: "initial",
            }}
          >
            <Typography
              fontWeight={300}
              color={(t) => t.palette.grey[700]}
              fontSize={15}
            >
              Hi,
            </Typography>
            <Typography color={(t) => t.palette.grey[700]} fontSize={15}>
              {user.name}
            </Typography>
          </Box>
          <Avatar
            variant="rounded"
            sx={{ bgcolor: "#EBEFFF", color: "text.primary" }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
        </Button>
        <Menu
          id="basic-menu"
          variant="menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/settings");
            }}
          >
            Settings
          </MenuItem>
          <MenuItem onClick={handleClose}>Request demo</MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/logout");
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
