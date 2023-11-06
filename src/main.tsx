import ReactDOM from "react-dom/client";
import { clarity } from "react-microsoft-clarity";

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import "github-markdown-css/github-markdown-light.css";

import App from "./config/App";
import "./index.css";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTY_DSN,
    integrations: [new BrowserTracing()],
    environment: import.meta.env.VITE_SERVER_TYPE,
  });
  clarity.init(import.meta.env.VITE_CLARITY_ID);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
