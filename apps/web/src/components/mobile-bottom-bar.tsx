import { Link, useLocation } from "react-router";

import {
  FolderIcon,
  HouseIcon,
  TagIcon,
  UserIcon,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Home",
    icon: HouseIcon,
    path: "/dashboard",
  },
  {
    label: "Folders",
    icon: FolderIcon,
    path: "/dashboard/folders",
  },
  {
    label: "Tags",
    icon: TagIcon,
    path: "/dashboard/tags",
  },
  {
    label: "Profile",
    icon: UserIcon,
    path: "/dashboard/profile",
  },
];

export function MobileBottomBar() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Button
              asChild
              className={cn(
                "flex h-full flex-col gap-1 rounded-none",
                isActive && "text-primary"
              )}
              key={item.path}
              variant="ghost"
            >
              <Link to={item.path}>
                <Icon
                  className="h-6 w-6"
                  weight={isActive ? "fill" : "regular"}
                />
                <span className="text-xs">{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
