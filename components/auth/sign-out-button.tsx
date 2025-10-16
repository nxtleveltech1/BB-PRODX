"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

interface SignOutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive";
  showIcon?: boolean;
  className?: string;
}

export function SignOutButton({
  variant = "outline",
  showIcon = true,
  className = "",
}: SignOutButtonProps) {
  const handleSignOut = async () => {
    try {
      await signOut({
        redirectTo: "/",
        redirect: true,
      });
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error("Sign out error:", error);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      variant={variant}
      className={className}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      Sign out
    </Button>
  );
}