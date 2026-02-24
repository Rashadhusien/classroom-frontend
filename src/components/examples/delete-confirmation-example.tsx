"use client";

import { Button } from "@/components/ui/button";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import { Trash2 } from "lucide-react";

export function DeleteConfirmationExample() {
  const { confirmDelete } = useDeleteConfirmation();

  const handleDeleteUser = () => {
    confirmDelete({
      title: "Delete User",
      description:
        "Are you sure you want to delete this user? All their data will be permanently removed.",
      onConfirm: () => {
        console.log("User deleted");
        // Add your delete logic here
      },
      onCancel: () => {
        console.log("Delete cancelled");
      },
    });
  };

  const handleDeleteFile = () => {
    confirmDelete({
      title: "Delete File",
      description:
        "This file will be permanently deleted and cannot be recovered.",
      onConfirm: () => {
        console.log("File deleted");
        // Add your delete logic here
      },
    });
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Delete Confirmation Examples</h2>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Click the buttons below to see the global delete confirmation dialog
          in action.
        </p>

        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDeleteUser}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete User
          </Button>

          <Button
            variant="outline"
            onClick={handleDeleteFile}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete File
          </Button>
        </div>
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">How to use:</h3>
        <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
          {`import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";

const { confirmDelete } = useDeleteConfirmation();

const handleDelete = () => {
  confirmDelete({
    title: "Custom Title",
    description: "Custom description message",
    onConfirm: () => {
      // Your delete logic here
    },
    onCancel: () => {
      // Optional cancel handler
    },
  });
};`}
        </pre>
      </div>
    </div>
  );
}
