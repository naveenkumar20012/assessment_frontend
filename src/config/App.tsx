import { Provider as StateProvider } from "react-redux";

import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import StyledEngineProvider from "@mui/styled-engine-sc/StyledEngineProvider";
import { store } from "src/redux/store";

import Routes from "./Routes";

const theme = createTheme({
  palette: {
    background: {
      default: "#f1f2f6",
    },
    primary: {
      main: "#2D68C4",
    },
    error: {
      main: "#E70C0C",
    },
    text: {
      primary: "#444444",
    },
  },
});

const App = () => {
  return (
    <StateProvider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes />
        </ThemeProvider>
      </StyledEngineProvider>
    </StateProvider>
  );
};

export default App;
