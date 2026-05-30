import { Navigate } from "react-router-dom";

function getUser() {
  try {
    const raw = localStorage.getItem("edureach_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ProtectedRoute({ children, requiredRole }) {
  const user = getUser();

  // Not logged in at all
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}