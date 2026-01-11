import type React from "react";

import { useMediaQuery } from "usehooks-ts";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const DESKTOP_BREAKPOINT = "(min-width: 768px)";

type ResponsiveModalProps = React.ComponentProps<typeof Dialog> &
  React.ComponentProps<typeof Drawer>;

function ResponsiveModal({ children, ...props }: ResponsiveModalProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <Dialog {...props}>{children}</Dialog>;
  }

  return <Drawer {...props}>{children}</Drawer>;
}

type ResponsiveModalTriggerProps = React.ComponentProps<typeof DialogTrigger> &
  React.ComponentProps<typeof DrawerTrigger>;

function ResponsiveModalTrigger({
  children,
  ...props
}: ResponsiveModalTriggerProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <DialogTrigger {...props}>{children}</DialogTrigger>;
  }

  return <DrawerTrigger {...props}>{children}</DrawerTrigger>;
}

type ResponsiveModalCloseProps = React.ComponentProps<typeof DialogClose> &
  React.ComponentProps<typeof DrawerClose>;

function ResponsiveModalClose({
  children,
  ...props
}: ResponsiveModalCloseProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <DialogClose {...props}>{children}</DialogClose>;
  }

  return <DrawerClose {...props}>{children}</DrawerClose>;
}

type ResponsiveModalContentProps = React.ComponentProps<typeof DialogContent> &
  React.ComponentProps<typeof DrawerContent>;

function ResponsiveModalContent({
  children,
  className,
  ...props
}: ResponsiveModalContentProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return (
      <DialogContent className={className} {...props}>
        {children}
      </DialogContent>
    );
  }

  return (
    <DrawerContent className={className} {...props}>
      {children}
    </DrawerContent>
  );
}

type ResponsiveModalHeaderProps = React.ComponentProps<typeof DialogHeader> &
  React.ComponentProps<typeof DrawerHeader>;

function ResponsiveModalHeader({
  children,
  ...props
}: ResponsiveModalHeaderProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <DialogHeader {...props}>{children}</DialogHeader>;
  }

  return <DrawerHeader {...props}>{children}</DrawerHeader>;
}

type ResponsiveModalFooterProps = React.ComponentProps<typeof DialogFooter> &
  React.ComponentProps<typeof DrawerFooter>;

function ResponsiveModalFooter({
  children,
  ...props
}: ResponsiveModalFooterProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <DialogFooter {...props}>{children}</DialogFooter>;
  }

  return (
    <DrawerFooter className="flex flex-row *:flex-1" {...props}>
      {children}
    </DrawerFooter>
  );
}

type ResponsiveModalTitleProps = React.ComponentProps<typeof DialogTitle> &
  React.ComponentProps<typeof DrawerTitle>;

function ResponsiveModalTitle({
  children,
  ...props
}: ResponsiveModalTitleProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <DialogTitle {...props}>{children}</DialogTitle>;
  }

  return (
    <DrawerTitle className="text-center" {...props}>
      {children}
    </DrawerTitle>
  );
}

type ResponsiveModalDescriptionProps = React.ComponentProps<
  typeof DialogDescription
> &
  React.ComponentProps<typeof DrawerDescription>;

function ResponsiveModalDescription({
  children,
  ...props
}: ResponsiveModalDescriptionProps) {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT, {
    initializeWithValue: false,
    defaultValue: true,
  });

  if (isDesktop) {
    return <DialogDescription {...props}>{children}</DialogDescription>;
  }

  return (
    <DrawerDescription className="hidden" {...props}>
      {children}
    </DrawerDescription>
  );
}

export {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
};
