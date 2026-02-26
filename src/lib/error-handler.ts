import { toast } from "sonner";

export interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export interface ErrorConfig {
  title?: string;
  description?: string;
  fallback?: {
    title: string;
    description: string;
  };
}

const ERROR_MESSAGES = {
  // Authentication Errors (401)
  401: {
    title: "Authentication Required",
    description: "Please log in to perform this action.",
  },

  // Authorization Errors (403)
  403: {
    title: "Access Denied",
    description: "You don't have permission to perform this action.",
  },

  // Not Found Errors (404)
  404: {
    title: "Not Found",
    description: "The requested resource was not found.",
  },

  // Validation Errors (400)
  400: {
    title: "Invalid Data",
    description: "Please check your input and try again.",
  },

  // Server Errors (500)
  500: {
    title: "Server Error",
    description: "Something went wrong. Please try again later.",
  },

  // Network Errors
  network: {
    title: "Network Error",
    description: "Please check your internet connection and try again.",
  },
};

const SPECIFIC_ERROR_HANDLERS = {
  // Permission denied for students
  "Access denied. Only teachers and admins can perform this action": {
    title: "Permission Denied",
    description:
      "Only teachers and administrators can perform this action. Please contact your administrator if you need access.",
  },

  "Access denied. Only teachers and admins can modify classes": {
    title: "Permission Denied",
    description:
      "Only teachers and administrators can modify classes. You can only view classes you're enrolled in.",
  },

  "Access denied. You can only modify your own classes": {
    title: "Permission Denied",
    description:
      "You can only modify classes that you created. Please contact the class owner if you need changes.",
  },

  "Access denied. Only teachers and admins can manage content": {
    title: "Permission Denied",
    description:
      "Only teachers and administrators can manage content. Students have view-only access.",
  },

  "You are not enrolled": {
    title: "Access Denied",
    description:
      "You must be enrolled in this class to access this content. Please join the class first.",
  },

  "Not your class": {
    title: "Access Denied",
    description:
      "You can only access content for classes you're enrolled in or teaching.",
  },

  // Class/lecture not found
  "Class not found": {
    title: "Class Not Found",
    description:
      "The class you're looking for doesn't exist or has been removed.",
  },

  "Lecture not found": {
    title: "Lecture Not Found",
    description:
      "The lecture you're looking for doesn't exist or has been removed.",
  },

  // Validation errors
  "classId and title are required": {
    title: "Missing Information",
    description:
      "Please fill in all required fields marked with an asterisk (*).",
  },

  "Invalid classId": {
    title: "Invalid Selection",
    description: "Please select a valid class from the dropdown.",
  },

  "Invalid lecture id": {
    title: "Invalid Lecture",
    description: "The lecture ID is invalid. Please try again.",
  },

  // Enrollment errors
  "Already enrolled": {
    title: "Already Enrolled",
    description: "You're already enrolled in this class.",
  },

  "Class is full": {
    title: "Class Full",
    description:
      "This class has reached its maximum capacity. Please contact the instructor.",
  },

  "Invalid invite code": {
    title: "Invalid Code",
    description: "The invite code is incorrect. Please check and try again.",
  },
};

/**
 * Extract error message from various error formats
 */
export const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    // Axios/HTTP error format
    if ("response" in error && error.response) {
      const response = error.response as {
        data?: { error?: string; message?: string };
        statusText?: string;
      };
      if (response.data?.error) {
        const errorMsg = response.data.error;
        // Don't return raw JSON error objects
        if (typeof errorMsg === "string" && !errorMsg.startsWith("{")) {
          return errorMsg;
        }
        // If it's a JSON object, return a generic message
        return "An error occurred while processing your request.";
      }
      if (response.data?.message) return response.data.message;
      if (response.statusText) return response.statusText;
    }

    // Direct error object
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  // String error - filter out JSON objects
  if (typeof error === "string") {
    if (error.startsWith("{") && error.includes("error")) {
      return "An error occurred while processing your request.";
    }
    return error;
  }

  return "An unexpected error occurred";
};

/**
 * Get HTTP status code from error
 */
export const getErrorStatus = (error: unknown): number | null => {
  if (error && typeof error === "object" && "response" in error) {
    const response = error.response as { status?: number };
    if (response?.status) return response.status;
  }
  return null;
};

/**
 * Handle API errors with user-friendly toast notifications
 */
export const handleError = (error: unknown, config?: ErrorConfig) => {
  const errorMessage = extractErrorMessage(error);
  const statusCode = getErrorStatus(error);

  console.error("API Error:", error);

  // Check for specific error handlers first
  if (
    errorMessage &&
    SPECIFIC_ERROR_HANDLERS[
      errorMessage as keyof typeof SPECIFIC_ERROR_HANDLERS
    ]
  ) {
    const handler =
      SPECIFIC_ERROR_HANDLERS[
        errorMessage as keyof typeof SPECIFIC_ERROR_HANDLERS
      ];
    toast.error(handler.title, {
      description: handler.description,
      richColors: true,
    });
    return;
  }

  // Check for status code handlers
  if (statusCode && ERROR_MESSAGES[statusCode as keyof typeof ERROR_MESSAGES]) {
    const statusHandler =
      ERROR_MESSAGES[statusCode as keyof typeof ERROR_MESSAGES];
    toast.error(statusHandler.title, {
      description: statusHandler.description,
      richColors: true,
    });
    return;
  }

  // Check for network errors
  if (
    errorMessage.toLowerCase().includes("network") ||
    errorMessage.toLowerCase().includes("fetch")
  ) {
    toast.error(ERROR_MESSAGES.network.title, {
      description: ERROR_MESSAGES.network.description,
      richColors: true,
    });
    return;
  }

  // Use custom config if provided
  if (config) {
    toast.error(config.title || "Error", {
      description: config.description || errorMessage,
      richColors: true,
    });
    return;
  }

  // Fallback error message - never show raw error object
  if (errorMessage.startsWith("{") && errorMessage.includes("error")) {
    // Don't show raw error objects, use generic message
    toast.error("Error", {
      description: "Something went wrong. Please try again.",
      richColors: true,
    });
  } else {
    toast.error("Error", {
      description: errorMessage,
      richColors: true,
    });
  }
};

/**
 * Handle success messages
 */
export const handleSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    richColors: true,
  });
};

/**
 * Handle loading/progress messages
 */
export const handleProgress = (message: string, description?: string) => {
  toast(message, {
    description,
    richColors: true,
  });
};
