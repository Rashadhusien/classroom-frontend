"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationState {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DeleteConfirmationContextType {
  state: DeleteConfirmationState;
  confirmDelete: (config: Omit<DeleteConfirmationState, "isOpen">) => void;
  closeDialog: () => void;
}

const DeleteConfirmationContext =
  React.createContext<DeleteConfirmationContextType | null>(null);

export function DeleteConfirmationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState<DeleteConfirmationState>({
    isOpen: false,
  });

  const confirmDelete = React.useCallback(
    (config: Omit<DeleteConfirmationState, "isOpen">) => {
      setState({
        isOpen: true,
        ...config,
      });
    },
    [],
  );

  const closeDialog = React.useCallback(() => {
    setState((prev) => {
      prev.onCancel?.();
      return { ...prev, isOpen: false };
    });
  }, []);

  const handleConfirm = React.useCallback(() => {
    setState((prev) => {
      prev.onConfirm?.();
      return { ...prev, isOpen: false };
    });
  }, []);

  const contextValue = React.useMemo(
    () => ({
      state,
      confirmDelete,
      closeDialog,
    }),
    [state, confirmDelete, closeDialog],
  );

  return React.createElement(
    DeleteConfirmationContext.Provider,
    { value: contextValue },
    children,
    React.createElement(DeleteConfirmationDialog, {
      isOpen: state.isOpen,
      title: state.title,
      description: state.description,
      onConfirm: handleConfirm,
      onCancel: closeDialog,
    }),
  );
}

export function useDeleteConfirmation() {
  const context = React.useContext(DeleteConfirmationContext);
  if (!context) {
    throw new Error(
      "useDeleteConfirmation must be used within a DeleteConfirmationProvider",
    );
  }
  return context;
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmationDialog({
  isOpen,
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return React.createElement(
    AlertDialog,
    { open: isOpen, onOpenChange: (open) => !open && onCancel() },
    React.createElement(
      AlertDialogContent,
      null,
      React.createElement(
        AlertDialogHeader,
        null,
        React.createElement(AlertDialogTitle, null, title),
        React.createElement(AlertDialogDescription, null, description),
      ),
      React.createElement(
        AlertDialogFooter,
        null,
        React.createElement(AlertDialogCancel, { onClick: onCancel }, "Cancel"),
        React.createElement(
          AlertDialogAction,
          {
            onClick: onConfirm,
            className:
              "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          },
          "Delete",
        ),
      ),
    ),
  );
}
