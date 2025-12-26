import { AsteriskIcon } from "@phosphor-icons/react";

export function Logo() {
  return (
    <div className="flex items-center gap-1">
      <AsteriskIcon />
      <span>{import.meta.env.VITE_APP_NAME || "keepstash"}</span>
    </div>
  );
}
