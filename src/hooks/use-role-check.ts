import { useGetIdentity } from "@refinedev/core";
import { User } from "@/types";

export type UserRole = "admin" | "teacher" | "student";

export const useRoleCheck = () => {
  const { data: user, isLoading } = useGetIdentity<User>();

  const hasRole = (requiredRole: UserRole): boolean => {
    if (isLoading || !user) return false;
    return user.role === requiredRole;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (isLoading || !user) return false;
    return roles.includes(user.role as UserRole);
  };

  const isAdmin = (): boolean => hasRole("admin");
  const isTeacher = (): boolean => hasRole("teacher");
  const isStudent = (): boolean => hasRole("student");

  const canCreateClass = (): boolean => hasAnyRole(["admin", "teacher"]);
  const canManageUsers = (): boolean => isAdmin();
  const canManageContent = (): boolean => hasAnyRole(["admin", "teacher"]);
  const canViewDashboard = (): boolean => true;

  return {
    user,
    isLoading,
    hasRole,
    hasAnyRole,
    isAdmin,
    isTeacher,
    isStudent,
    canCreateClass,
    canManageUsers,
    canManageContent,
    canViewDashboard,
  };
};
