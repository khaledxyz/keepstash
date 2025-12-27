import { Activity, useState } from "react";

import { ListIcon, SquaresFourIcon } from "@phosphor-icons/react";

import { BookmarkCard } from "@/components/bookmark-card";
import { BookmarkItem } from "@/components/bookmark-item";
import { FiltersToolbar } from "@/components/filters";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <>
      <Navbar />
      <main className="container">
        <FiltersToolbar />

        <div className="mt-4 flex items-center justify-end gap-1">
          <Button
            onClick={() => setView("list")}
            size="icon"
            variant={view === "list" ? "default" : "outline"}
          >
            <ListIcon />
          </Button>
          <Button
            onClick={() => setView("grid")}
            size="icon"
            variant={view === "grid" ? "default" : "outline"}
          >
            <SquaresFourIcon />
          </Button>
        </div>

        <div className="mt-6">
          <Activity mode={view === "list" ? "visible" : "hidden"}>
            <div className="space-y-2">
              <BookmarkItem />
              <BookmarkItem />
              <BookmarkItem />
            </div>
          </Activity>

          <Activity mode={view === "grid" ? "visible" : "hidden"}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <BookmarkCard />
              <BookmarkCard />
              <BookmarkCard />
            </div>
          </Activity>
        </div>
      </main>
    </>
  );
}
