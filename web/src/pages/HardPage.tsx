import { Navigate } from "react-router-dom";

export function HardPage() {
  return <Navigate to="/english/maybe?filter=hard" replace />;
}
