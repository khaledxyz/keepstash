/** biome-ignore-all lint/style/noNonNullAssertion: <not needed> */

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./app";

import "./index.css";

import { client } from "@keepstash/ts-sdk";

import { getApiBaseUrl } from "@/lib/env";

const baseUrl = getApiBaseUrl();

client.setConfig({
  baseUrl,
  credentials: "include",
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
