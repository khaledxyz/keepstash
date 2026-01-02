import type React from "react";

import { Logo } from "@/components/logo";

interface Props {
  title: string;
  children: React.ReactNode;
}

export function AuthCard({ title, children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <Logo size="lg" />
          <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
