import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/authContext";

function ProtectedRoute({ requiredRole }) {
  const { authUser, authReady, hasRole } = useAuth();

  if (!authReady) return <h1>Loading...</h1>;
  if (!authUser) return <Navigate to="/login" replace />;
  if (requiredRole && !hasRole(requiredRole))
    return <h1>Insufficient permissions</h1>;
  return <Outlet />;
}

export default ProtectedRoute;
