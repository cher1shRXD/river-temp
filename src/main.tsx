import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppStateProvider } from "@b1nd/aid-kit/app-state";
import { BridgeProvider } from "@b1nd/aid-kit/bridge-kit/web";
import { SafeAreaProvider } from "@b1nd/aid-kit/safe-area-provider";
import { RouteProvider, Router } from "@b1nd/aid-kit/navigation";

const routes = {
  tabs: [{ path: "/", index: true, element: App }],
  stacks: [],
};

createRoot(document.getElementById("root")!).render(
  <AppStateProvider>
    <BridgeProvider>
      <SafeAreaProvider>
        <RouteProvider routes={routes}>
          <Router routes={routes} />
        </RouteProvider>
      </SafeAreaProvider>
    </BridgeProvider>
  </AppStateProvider>,
);
