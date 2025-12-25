import type { ReactNode } from "react";

import { ThemeProvider } from "@providers/theme-provider";

interface Props {
  children: ReactNode;
}

const themeStorageKey = `${import.meta.env.VITE_SOME_KEY || "vite"}-theme`;

export function Providers({ children }: Props) {
  return (
    <ThemeProvider defaultTheme="system" storageKey={themeStorageKey}>
      {children}
    </ThemeProvider>
  );
}
