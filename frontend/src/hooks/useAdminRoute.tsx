import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";

export function useAdminRoute() {
  const { isAuthenticated, isLoading, isAdministrator } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login", { replace: true });
      } else if (!isAdministrator) {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, isAdministrator, navigate]);

  return { isLoading };
}

