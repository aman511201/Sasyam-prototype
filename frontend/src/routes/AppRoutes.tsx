import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import Analytics from "@/pages/Analytics";
import Assistant from "@/pages/Assistant";
import Crops from "@/pages/Crops";
import Dashboard from "@/pages/Dashboard";
import DecisionEngine from "@/pages/DecisionEngine";
import DiseaseDetection from "@/pages/DiseaseDetection";
import Login from "@/pages/Login";
import Logistics from "@/pages/Logistics";
import Market from "@/pages/Market";
import Produce from "@/pages/Produce";
import Weather from "@/pages/Weather";
import NotFound from "@/pages/NotFound";
import AppLayout from "@/layouts/AppLayout";

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="crops" element={<Crops />} />
          <Route path="disease-detection" element={<DiseaseDetection />} />
          <Route path="produce" element={<Produce />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="decision-engine" element={<DecisionEngine />} />
          <Route path="market" element={<Market />} />
          <Route path="weather" element={<Weather />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="assistant" element={<Assistant />} />
        </Route>

        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;