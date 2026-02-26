import React from "react";
import { Navigate, useLocation } from "react-router";
import { useCan } from "@refinedev/core";

interface ProtectedRouteProps {
  children: React.ReactNode;
  resource: string;
  action: string;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  resource,
  action,
  fallbackPath = "/unauthorized",
}) => {
  const location = useLocation();
  const { data: canAccess, isLoading } = useCan({
    resource,
    action,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canAccess?.can) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
