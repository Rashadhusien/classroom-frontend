import React from "react";
import { Navigate } from "react-router";
import { useRoleCheck, UserRole } from "@/hooks/use-role-check";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback,
}) => {
  const { hasAnyRole, isLoading } = useRoleCheck();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAnyRole(allowedRoles)) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Preconfigured guards for common use cases
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <RoleGuard allowedRoles={["admin"]}>
    {children}
  </RoleGuard>
);

export const TeacherGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <RoleGuard allowedRoles={["teacher", "admin"]}>
    {children}
  </RoleGuard>
);

export const StudentGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <RoleGuard allowedRoles={["student"]}>
    {children}
  </RoleGuard>
);
