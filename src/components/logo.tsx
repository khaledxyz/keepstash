import { AsteriskIcon } from "@phosphor-icons/react";

export function Logo() {
  return (
    <div>
      <AsteriskIcon />
      <span>{import.meta.env.VITE_APP_NAME || "keepstash"}</span>
    </div>
  );
}
