import type { VariantProps } from "class-variance-authority";

import { Link } from "react-router";

import { AsteriskIcon } from "@phosphor-icons/react";
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
  extends VariantProps<typeof logoVariants>,
    Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  isLink?: boolean;
  href?: string;
}

export function Logo({
  size,
  className,
  isLink = false,
  href = "/",
  ...props
}: LogoProps) {
  const content = (
    <>
      <AsteriskIcon weight="bold" />
      <span>{import.meta.env.VITE_APP_NAME || "keepstash"}</span>
    </>
  );

  if (isLink) {
    return (
      <Link className={cn(logoVariants({ size }), className)} to={href}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cn(logoVariants({ size }), className)} {...props}>
      {content}
    </div>
  );
}
