import type React from "react";

import { Logo } from "@/components/logo";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  title: string;
  children: React.ReactNode;
}
export function AuthCard({ title, children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Logo size="lg" />
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
}
