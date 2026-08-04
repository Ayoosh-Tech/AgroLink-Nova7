import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth.js";
import Loader from "../common/Loader.jsx";

// Wrap any route element that requires login:
//   <ProtectedRoute><Cart /></ProtectedRoute>
// Restrict to specific roles:
//   <ProtectedRoute roles={["farmer"]}><FarmerDashboard /></ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (loading) return <Loader label={t("protectedRoute.checkingSession")} />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
