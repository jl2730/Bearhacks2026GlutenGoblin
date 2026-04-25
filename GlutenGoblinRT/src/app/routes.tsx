import { createBrowserRouter } from "react-router";
import MobileFrame from "./components/MobileFrame";
import HomePage from "./pages/HomePage";
import ScanningFrontPage from "./pages/ScanningFrontPage";
import ScanningBackPage from "./pages/ScanningBackPage";
import ResultPage from "./pages/ResultPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MobileFrame,
    children: [
      { index: true, Component: HomePage },
      { path: "scanning-front", Component: ScanningFrontPage },
      { path: "scanning-back", Component: ScanningBackPage },
      { path: "result", Component: ResultPage },
    ],
  },
]);
