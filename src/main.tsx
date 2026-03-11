import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

const rootElement = document.getElementById("root");

if (rootElement) {
  enableMocking().then(() => {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
}
