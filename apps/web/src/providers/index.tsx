import type { ReactNode } from "react";

import { PromptProvider } from "@/hooks/use-prompt";

import { ThemeProvider } from "@/providers/theme-provider";

interface Props {
  children: ReactNode;
}

const themeStorageKey = `${import.meta.env.VITE_APP_NAME || "keepstash"}-theme`;

export function Providers({ children }: Props) {
  return (
    <ThemeProvider defaultTheme="system" storageKey={themeStorageKey}>
      <PromptProvider>{children}</PromptProvider>
    </ThemeProvider>
  );
}
