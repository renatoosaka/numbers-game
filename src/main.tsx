import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Home } from "./pages/home.tsx";
import { GameProvider } from "./context/game.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameProvider>
      <Home />
    </GameProvider>
  </StrictMode>
);
