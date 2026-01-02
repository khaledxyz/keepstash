import { Link } from "react-router";

import {
  CreditCardIcon,
  GearIcon,
  GithubLogoIcon,
  KeyboardIcon,
  LifebuoyIcon,
  SignOutIcon,
  UserIcon,
} from "@phosphor-icons/react";

import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  email?: string;
  name?: string;
}

export function UserDropdown({ email = "", name = "" }: Props) {
  async function handleSignOut() {
    await authClient.signOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button className="rounded-full" size="icon" variant="ghost">
          <Avatar>
            {/* TODO: add gravatar */}
            <AvatarFallback>
              {name ? getInitials(name) : <UserIcon />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuLabel className="flex flex-col">{email}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/settings">
              <GearIcon />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <KeyboardIcon />
            Keyboard shortcuts
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              rel="noopener noreferrer"
              target="_blank"
              to="https://github.com/khaledxyz/keepstash"
            >
              <GithubLogoIcon />
              <span>GitHub</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifebuoyIcon />
            Support
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} variant="destructive">
          <SignOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
