import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./admin.css";

// Lazy loading admin pages
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));

const AdminLoading = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(220 20% 6%)" }}>
    <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "hsl(175 80% 50%) transparent" }} />
  </div>
);

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "auth" | "unauth">("loading");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? "auth" : "unauth");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? "auth" : "unauth");
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (status === "loading") {
    return <AdminLoading />;
  }

  return status === "auth" ? <>{children}</> : <Navigate to="/paneladmin/login" replace />;
}

export default function AdminApp() {
  return (
    <div id="admin-root">
      <Suspense fallback={<AdminLoading />}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}
