"use client";

import { useAuth } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";

export function AuthenticatedToaster() {
  const { user } = useAuth();
  if (!user) return null;
  return <Toaster />;
}
