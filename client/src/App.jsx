import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home            from "./pages/Home";
import Recommendations from "./pages/Recommendations";
import Admin           from "./pages/Admin";
import ProtectedRoute  from "./components/ProtectedRoute";
import NotFound        from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/"                element={<Home />} />
        <Route path="/recommendations" element={<Recommendations />} />

        {/* ── Admin — protected, requires admin role ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* ── 404 — catches everything else ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}