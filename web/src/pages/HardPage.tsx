import { Navigate } from "react-router-dom";

export function HardPage() {
  return <Navigate to="/study?hardOnly=1" replace />;
}
