import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./admin.css";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

export default function AdminApp() {
  return (
    <div id="admin-root">
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}
