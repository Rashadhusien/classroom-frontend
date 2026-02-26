import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/refine-ui/theme/theme-toggle";

import { cn } from "@/lib/utils";
import { User as UserType } from "@/types";
import { useGetIdentity } from "@refinedev/core";
import { Home, BookOpen, Menu } from "lucide-react";
import UserDropdown from "../UserDropdown";

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useGetIdentity<UserType>();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const DesktopHeader = () => (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-16",
        "shrink-0",
        "items-center",
        "gap-4",
        "border-b",
        "border-border",
        "bg-background/80",
        "backdrop-blur-md",
        "pr-3",
        "z-40",
        "px-4",
      )}
    >
      {/* Logo Left */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Classroom Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-foreground">Classroom</span>
        </Link>
      </div>

      {/* Links Center */}
      <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
        <Link
          to="/"
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          <Home className="w-4 h-4 inline mr-1" />
          Home
        </Link>
        <Link
          to="/classes"
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          <BookOpen className="w-4 h-4 inline mr-1" />
          Classes
        </Link>
      </nav>

      {/* Auth Right */}
      <div className="flex items-center gap-4">
        <ThemeToggle className="h-8 w-8" />
        {user ? (
          <UserDropdown />
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );

  const MobileHeader = () => (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-12",
        "shrink-0",
        "items-center",
        "gap-2",
        "border-b",
        "border-border",
        "bg-background/80",
        "backdrop-blur-md",
        "pr-3",
        "justify-between",
        "z-40",
      )}
    >
      {/* Mobile Menu Trigger */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Classroom Logo" className="h-6 w-6" />
        <span className="font-bold text-lg text-foreground">Classroom</span>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <ThemeToggle className="h-6 w-6" />
        {user ? (
          <UserDropdown />
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );

  return <>{isMobile ? <MobileHeader /> : <DesktopHeader />}</>;
};

export default Header;
