import { AsteriskIcon } from "@phosphor-icons/react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const logoVariants = cva("inline-flex select-none items-center font-medium", {
  variants: {
    size: {
      sm: "gap-1 text-sm [&_svg:not([class*='size-'])]:size-3",
      md: "gap-1.5 text-base [&_svg:not([class*='size-'])]:size-4",
      lg: "gap-2 text-lg [&_svg:not([class*='size-'])]:size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface LogoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof logoVariants> {}

export function Logo({ size, className, ...props }: LogoProps) {
  return (
    <div className={cn(logoVariants({ size }), className)} {...props}>
      <AsteriskIcon weight="bold" />
      <span>{import.meta.env.VITE_APP_NAME || "keepstash"}</span>
    </div>
  );
}
