import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuthStore();
  if (loading) return <div className="loading">Loading FinFlow…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
