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

import { ThemePicker } from "@/components/theme-picker";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
  }

  const email = session?.user.email ?? "";
  const name = session?.user.name ?? "";

  return (
    <div className="container max-w-2xl">
      <div className="mb-6">
        <h1 className="font-bold text-3xl">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {name ? getInitials(name) : <UserIcon className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{name || "User"}</h2>
              <p className="text-muted-foreground text-sm">{email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Appearance */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="font-semibold">Appearance</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-muted-foreground text-sm">
                Choose your preferred theme
              </p>
            </div>
            <ThemePicker />
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <Button
            asChild
            className="w-full justify-start rounded-none"
            variant="ghost"
          >
            <Link to="/dashboard/settings">
              <GearIcon className="mr-3 h-5 w-5" />
              <span>Settings</span>
            </Link>
          </Button>
          <Separator />
          <Button
            className="w-full justify-start rounded-none"
            disabled
            variant="ghost"
          >
            <CreditCardIcon className="mr-3 h-5 w-5" />
            <span>Billing</span>
          </Button>
          <Separator />
          <Button
            className="w-full justify-start rounded-none"
            disabled
            variant="ghost"
          >
            <KeyboardIcon className="mr-3 h-5 w-5" />
            <span>Keyboard shortcuts</span>
          </Button>
        </CardContent>
      </Card>

      {/* Support & Links */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <Button
            asChild
            className="w-full justify-start rounded-none"
            variant="ghost"
          >
            <Link
              rel="noopener noreferrer"
              target="_blank"
              to="https://github.com/khaledxyz/keepstash"
            >
              <GithubLogoIcon className="mr-3 h-5 w-5" />
              <span>GitHub</span>
            </Link>
          </Button>
          <Separator />
          <Button
            className="w-full justify-start rounded-none"
            disabled
            variant="ghost"
          >
            <LifebuoyIcon className="mr-3 h-5 w-5" />
            <span>Support</span>
          </Button>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Button
        className="w-full"
        onClick={handleSignOut}
        size="lg"
        variant="destructive"
      >
        <SignOutIcon className="mr-2 h-5 w-5" />
        Log out
      </Button>
    </div>
  );
}
