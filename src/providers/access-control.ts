import { authProvider } from "./auth";

export type UserRole = "admin" | "teacher" | "student";

// Role-based permissions configuration
const ROLE_PERMISSIONS = {
  admin: {
    // Admin can do everything
    resources: ["*"],
    actions: ["*"],
  },
  teacher: {
    // Teacher permissions
    resources: [
      "classes",
      "lectures",
      "subjects",
      "departments",
      "enrollments",
    ],
    actions: ["list", "show", "create", "edit", "delete"],
  },
  student: {
    // Student permissions
    resources: ["classes", "lectures", "enrollments"],
    actions: ["list", "show"],
  },
} as const;

export const accessControlProvider = {
  can: async ({ resource, action, params }: any) => {
    try {
      // Get current user from auth provider
      const user = await authProvider.getIdentity?.();

      if (!user) {
        return { can: false, reason: "Not authenticated" };
      }

      const userRole = user.role as UserRole;
      const permissions = ROLE_PERMISSIONS[userRole];

      if (!permissions) {
        return { can: false, reason: "Invalid role" };
      }

      // Check if user has access to all resources
      if (permissions.resources.includes("*")) {
        return { can: true };
      }

      // Check if user has access to this resource
      if (!permissions.resources.includes(resource)) {
        return { can: false, reason: "No access to resource" };
      }

      // Check if user has access to all actions
      if (permissions.actions.includes("*")) {
        return { can: true };
      }

      // Check if user has access to this action
      if (!permissions.actions.includes(action)) {
        return { can: false, reason: "No access to action" };
      }

      // Additional checks for specific scenarios
      if (
        userRole === "teacher" &&
        resource === "classes" &&
        action === "edit"
      ) {
        // Teachers can only edit their own classes
        // This would require checking class ownership using params.id
        return { can: true }; // Simplified for now
      }

      if (
        userRole === "student" &&
        resource === "classes" &&
        action === "show"
      ) {
        // Students can only view classes they're enrolled in
        // This would require checking enrollment using params.id
        return { can: true }; // Simplified for now
      }

      return { can: true };
    } catch (error) {
      console.error("Access control error:", error);
      return { can: false, reason: "Access control error" };
    }
  },

  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true, // Show disabled buttons instead of hiding
    },
    queryOptions: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  },
};
