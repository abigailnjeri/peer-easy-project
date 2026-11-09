import { Navigate } from "react-router-dom";

// Blocks pages unless logged in, and (optionally) unless the role is allowed.
export default function ProtectedRoute({ allow, children }) {
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token || !user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(user.role))
    return <Navigate to="/login" replace />;
  return children;
}
