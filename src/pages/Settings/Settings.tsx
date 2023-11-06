import { useLocation } from "react-router-dom";

import Paper from "@mui/material/Paper";
import SettingsSideBar from "src/components/SettingsSideBar/SettingsSideBar";
import TransactionTable from "src/components/TransactionTable/TransactionTable";
import Usage from "src/components/Usage/Usage";
import CompanyDetailsForm from "src/forms/CompanyDetailsForm/CompanyDetailsForm";
import PasswordChangeForm from "src/forms/PasswordChangeForm/PasswordChangeForm";
import PersonalDetailsForm from "src/forms/PersonalDetailsForm/PersonalDetailsForm";
import { FullContainer, SideBar } from "src/styles";

import { SettingsContainer } from "./Settings.styles";

const Settings = () => {
  const { hash } = useLocation();
  return (
    <FullContainer>
      <SideBar>
        <SettingsSideBar />
      </SideBar>
      <SettingsContainer>
        <Paper
          elevation={0}
          variant="outlined"
          sx={{ height: "100%", width: "100%", overflow: "scroll" }}
        >
          {hash === "#personal-details" && <PersonalDetailsForm />}
          {hash === "#password" && <PasswordChangeForm />}
          {hash === "#company-details" && <CompanyDetailsForm />}
          {hash === "#plan-usage" && <Usage />}
          {hash === "#transactions" && <TransactionTable />}
        </Paper>
      </SettingsContainer>
    </FullContainer>
  );
};

export default Settings;
