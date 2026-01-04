import type { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { env } from "@/lib/env";
import { queryClient } from "@/lib/query-client";

import { PromptProvider } from "@/hooks/use-prompt";

import { ThemeProvider } from "@/providers/theme-provider";

import { Toaster } from "@/components/ui/sonner";

interface Props {
  children: ReactNode;
}

const themeStorageKey = `${env.appName}-theme`;

export function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey={themeStorageKey}>
        <Toaster position="bottom-center" richColors />
        <PromptProvider>{children}</PromptProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
