import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button, Tooltip, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";

import { SettingsSideBarContainer } from "./SettingsSideBar.styles";

const data = [
  {
    header: "Profile",
    children: [
      {
        label: "Personal details",
        hash: "#personal-details",
      },
      {
        label: "Password",
        hash: "#password",
      },
    ],
  },
  {
    header: "Company",
    children: [
      {
        label: "Company details",
        hash: "#company-details",
      },
      {
        label: "Team management",
        hash: "#team-management",
        disabled: true,
      },
    ],
  },
  {
    header: "Billing",
    children: [
      {
        label: "Payment & Invoices",
        hash: "#payment-invoices",
        disabled: true,
      },
      {
        label: "Plan & Usage",
        hash: "#plan-usage",
      },
      {
        label: "Transactions",
        hash: "#transactions",
      },
    ],
  },
];

const SettingsSideBar = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      navigate("#personal-details");
    }
  }, []);
  return (
    <SettingsSideBarContainer elevation={0} variant="outlined">
      <Stack width="100%" gap={3}>
        {data.map((group) => (
          <Stack gap={3} key={group.header}>
            <Typography fontWeight={500}>{group.header}</Typography>
            <Stack gap={2}>
              {group.children.map((link) => (
                <Button
                  key={link.label}
                  fullWidth
                  onClick={() => navigate(link.hash)}
                  sx={{
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                  color={hash === link.hash ? "primary" : "inherit"}
                  variant={hash === link.hash ? "outlined" : "text"}
                  disabled={link.disabled}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </SettingsSideBarContainer>
  );
};

export default SettingsSideBar;
