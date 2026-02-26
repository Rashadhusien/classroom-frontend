import { useGetIdentity, useShow } from "@refinedev/core";
import { User } from "@/types";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Mail, Calendar, Shield } from "lucide-react";
import { getInitials } from "@/lib/utils";

const Profile = () => {
  const { data: loggedUser, isLoading } = useGetIdentity<User>();

  const { query: userQuery } = useShow({
    resource: "users",
    id: loggedUser?.id,
  });

  const currentUser = userQuery.data?.data;

  if (isLoading) {
    return (
      <ListView>
        <div className="flex items-center justify-center h-64">
          <div className="text-foreground">Loading profile...</div>
        </div>
      </ListView>
    );
  }

  if (!currentUser) {
    return (
      <ListView>
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">User not found</div>
        </div>
      </ListView>
    );
  }

  // const handleEdit = () => {
  //   setEditForm({
  //     name: currentUser.name || "",
  //     email: currentUser.email || "",
  //   });
  //   setIsEditing(true);
  // };

  // const handleCancel = () => {
  //   setIsEditing(false);
  //   setEditForm({ name: "", email: "" });
  // };

  // const handleSave = () => {
  //   updateProfile(
  //     {
  //       resource: "users",
  //       id: currentUser.id,
  //       values: editForm,
  //     },
  //     {
  //       onSuccess: () => {
  //         setIsEditing(false);
  //       },
  //       onError: (error) => {
  //         console.error("Failed to update profile:", error);
  //       },
  //     },
  //   );
  // };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "teacher":
        return "default";
      case "student":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <ListView>
      <Breadcrumb />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="page-title">Profile</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentUser.image} />
                <AvatarFallback className="text-lg">
                  {getInitials(currentUser.name || "User")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleColor(currentUser.role)}>
                    {currentUser.role?.charAt(0).toUpperCase() +
                      currentUser.role?.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{currentUser.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  User ID
                </Label>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm">#{currentUser.id}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Account Created
                </Label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {currentUser.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Account Type
                </Label>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <Badge variant={getRoleColor(currentUser.role)}>
                    {currentUser.role?.charAt(0).toUpperCase() +
                      currentUser.role?.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ListView>
  );
};

export default Profile;
