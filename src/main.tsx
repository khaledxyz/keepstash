/** biome-ignore-all lint/style/noNonNullAssertion: <not needed> */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
