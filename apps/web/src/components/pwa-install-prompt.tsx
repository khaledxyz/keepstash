import { useState } from "react";

import { DownloadIcon, XIcon } from "@phosphor-icons/react";

import { usePWAInstall } from "@/hooks/use-pwa-install";

import { Button } from "@/components/ui/button";

export function PWAInstallPrompt() {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b bg-primary p-3 text-primary-foreground md:hidden">
      <div className="container flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <DownloadIcon className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">Install KeepStash</p>
            <p className="text-xs opacity-90">
              Install our app for a better experience
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={promptInstall} size="sm" variant="secondary">
            Install
          </Button>
          <Button
            onClick={() => setIsDismissed(true)}
            size="icon"
            variant="ghost"
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
