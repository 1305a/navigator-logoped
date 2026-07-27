import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AppStateProvider } from "@/context/AppStateContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <AppStateProvider>
        <TooltipProvider>
          <App />
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </AppStateProvider>
    </HashRouter>
  </StrictMode>,
);
