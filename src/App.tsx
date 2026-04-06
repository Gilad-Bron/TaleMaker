import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import WorkspacePage from "./pages/WorkspacePage";
import PlayPage from "./pages/PlayPage";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tale/:id" element={<WorkspacePage />} />
        <Route path="/tale/:id/play" element={<PlayPage />} />
      </Routes>
    </TooltipProvider>
  );
}
