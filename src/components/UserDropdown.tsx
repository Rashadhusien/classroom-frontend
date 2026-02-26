import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { BookOpen, LogOutIcon, User } from "lucide-react";
import { UserAvatar } from "@/components/refine-ui/layout/user-avatar";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { User as UserType } from "@/types";

const UserDropdown = () => {
  const { data: user } = useGetIdentity<UserType>();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold">
            {user?.name ?? "Signed in user"}
          </p>
          {user?.email && (
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          )}
          {user?.role && (
            <span className="mt-2 inline-flex items-center rounded-sm bg-muted px-2 py-0.5 text-xs font-semibold uppercase text-muted-foreground">
              {user.role}
            </span>
          )}
        </div>
        <DropdownMenuSeparator />
        {user?.role !== "student" && (
          <DropdownMenuItem asChild>
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/classes" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            My Classes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          <LogOutIcon
            className={cn("text-destructive", "hover:text-destructive")}
          />
          <span className={cn("text-destructive", "hover:text-destructive")}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
