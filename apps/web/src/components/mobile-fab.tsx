import { useState } from "react";

import { PlusIcon } from "@phosphor-icons/react";

import { BookmarkDialog } from "@/features/bookmarks/components/bookmark-dialog";

import { Button } from "@/components/ui/button";

export function MobileFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="fixed right-4 bottom-20 z-40 h-14 w-14 rounded-full shadow-lg md:hidden"
        onClick={() => setOpen(true)}
        size="icon"
      >
        <PlusIcon className="size-6" />
        <span className="sr-only">Add bookmark</span>
      </Button>

      <BookmarkDialog onOpenChange={setOpen} open={open} />
    </>
  );
}
