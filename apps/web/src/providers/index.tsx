import type { ReactNode } from "react";

import { PromptProvider } from "@/hooks/use-prompt";

import { ThemeProvider } from "@/providers/theme-provider";

import { Toaster } from "@/components/ui/sonner";

interface Props {
  children: ReactNode;
}

const themeStorageKey = `${import.meta.env.VITE_APP_NAME || "keepstash"}-theme`;

export function Providers({ children }: Props) {
  return (
    <ThemeProvider defaultTheme="system" storageKey={themeStorageKey}>
      <Toaster />
      <PromptProvider>{children}</PromptProvider>
    </ThemeProvider>
  );
}
