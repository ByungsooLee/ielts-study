import { Navigate } from "react-router-dom";
import { useDomainStore } from "../stores/domainStore";

export function DomainRedirect() {
  const domain = useDomainStore((s) => s.domain);
  if (domain === "engineering") {
    return <Navigate to="/engineering/study" replace />;
  }
  return <Navigate to="/english/words" replace />;
}
