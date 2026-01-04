import type { VariantProps } from "class-variance-authority";

import { Link } from "react-router";

import { AsteriskIcon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";

import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

const logoVariants = cva(
  "group inline-flex select-none items-center gap-1 font-medium",
  {
    variants: {
      size: {
        sm: "text-sm [&_svg:not([class*='size-'])]:size-3",
        md: "text-base [&_svg:not([class*='size-'])]:size-4",
        lg: "text-lg [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

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
      <AsteriskIcon
        className="transition-transform duration-700 ease-out group-hover:rotate-180"
        weight="bold"
      />
      <span>{env.appName}</span>
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
