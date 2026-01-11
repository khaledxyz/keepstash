import { PlusIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

interface MobileFABProps {
  onClick: () => void;
  label?: string;
}

export function MobileFAB({ onClick, label = "Add" }: MobileFABProps) {
  return (
    <Button
      className="fixed right-4 bottom-20 z-40 h-14 w-14 rounded-full shadow-lg md:hidden"
      onClick={onClick}
      size="icon"
    >
      <PlusIcon className="size-6" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
