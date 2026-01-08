import type React from "react";

import { useMediaQuery } from "usehooks-ts";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const DESKTOP_BREAKPOINT = "(min-width: 768px)";

type ResponsiveSheetProps = React.ComponentProps<typeof Sheet> &
  React.ComponentProps<typeof Drawer>;

function ResponsiveSheet({ children, ...props }: ResponsiveSheetProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <Sheet {...props}>{children}</Sheet>;
  }

  return <Drawer {...props}>{children}</Drawer>;
}

type ResponsiveSheetTriggerProps = React.ComponentProps<typeof SheetTrigger> &
  React.ComponentProps<typeof DrawerTrigger>;

function ResponsiveSheetTrigger({
  children,
  ...props
}: ResponsiveSheetTriggerProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <SheetTrigger {...props}>{children}</SheetTrigger>;
  }

  return <DrawerTrigger {...props}>{children}</DrawerTrigger>;
}

type ResponsiveSheetCloseProps = React.ComponentProps<typeof SheetClose> &
  React.ComponentProps<typeof DrawerClose>;

function ResponsiveSheetClose({
  children,
  ...props
}: ResponsiveSheetCloseProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <SheetClose {...props}>{children}</SheetClose>;
  }

  return <DrawerClose {...props}>{children}</DrawerClose>;
}

type ResponsiveSheetContentProps = Omit<
  React.ComponentProps<typeof SheetContent>,
  "side"
> &
  React.ComponentProps<typeof DrawerContent> & {
    side?: "top" | "right" | "bottom" | "left";
  };

function ResponsiveSheetContent({
  children,
  className,
  side = "right",
  ...props
}: ResponsiveSheetContentProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return (
      <SheetContent className={className} side={side} {...props}>
        {children}
      </SheetContent>
    );
  }

  // Map sheet sides to drawer directions for better UX
  // Drawers work best from bottom on mobile
  return (
    <DrawerContent className={className} {...props}>
      {children}
    </DrawerContent>
  );
}

type ResponsiveSheetHeaderProps = React.ComponentProps<typeof SheetHeader> &
  React.ComponentProps<typeof DrawerHeader>;

function ResponsiveSheetHeader({
  children,
  ...props
}: ResponsiveSheetHeaderProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <SheetHeader {...props}>{children}</SheetHeader>;
  }

  return <DrawerHeader {...props}>{children}</DrawerHeader>;
}

type ResponsiveSheetFooterProps = React.ComponentProps<typeof SheetFooter> &
  React.ComponentProps<typeof DrawerFooter>;

function ResponsiveSheetFooter({
  children,
  ...props
}: ResponsiveSheetFooterProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <SheetFooter {...props}>{children}</SheetFooter>;
  }

  return <DrawerFooter {...props}>{children}</DrawerFooter>;
}

type ResponsiveSheetTitleProps = React.ComponentProps<typeof SheetTitle> &
  React.ComponentProps<typeof DrawerTitle>;

function ResponsiveSheetTitle({
  children,
  ...props
}: ResponsiveSheetTitleProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <SheetTitle {...props}>{children}</SheetTitle>;
  }

  return <DrawerTitle {...props}>{children}</DrawerTitle>;
}

type ResponsiveSheetDescriptionProps = React.ComponentProps<
  typeof SheetDescription
> &
  React.ComponentProps<typeof DrawerDescription>;

function ResponsiveSheetDescription({
  children,
  ...props
}: ResponsiveSheetDescriptionProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <SheetDescription {...props}>{children}</SheetDescription>;
  }

  return <DrawerDescription {...props}>{children}</DrawerDescription>;
}

export {
  ResponsiveSheet,
  ResponsiveSheetClose,
  ResponsiveSheetContent,
  ResponsiveSheetDescription,
  ResponsiveSheetFooter,
  ResponsiveSheetHeader,
  ResponsiveSheetTitle,
  ResponsiveSheetTrigger,
};
