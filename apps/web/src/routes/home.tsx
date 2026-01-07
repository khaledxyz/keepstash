import { Link, Navigate } from "react-router";

import {
  BookmarkIcon,
  FolderIcon,
  GithubLogoIcon,
  MagnifyingGlassIcon,
  TagIcon,
} from "@phosphor-icons/react";

import { env, isFeatureEnabled } from "@/lib/env";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const enableRootRedirect = isFeatureEnabled(env.enableRootRedirect);

  if (enableRootRedirect) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex items-center justify-between">
        <Logo size="lg" />
        <nav className="flex gap-1">
          <Button asChild variant="ghost">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="container flex flex-1 flex-col items-center justify-center py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 font-bold text-5xl tracking-tight sm:text-6xl">
            Save your links.
            <br />
            Find them later.
          </h1>
          <p className="mb-8 text-muted-foreground text-xl">
            A bookmark manager that works. Organize links with folders and tags,
            then actually find them when you need them.
          </p>
          <Button asChild size="lg">
            <Link to="/register">Get Started</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <BookmarkIcon className="mb-3 size-8 text-muted-foreground" />
            <h3 className="mb-1 font-semibold">Save Bookmarks</h3>
            <p className="text-muted-foreground text-sm">
              Store links with metadata
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FolderIcon className="mb-3 size-8 text-muted-foreground" />
            <h3 className="mb-1 font-semibold">Organize with Folders</h3>
            <p className="text-muted-foreground text-sm">
              Group related bookmarks
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <TagIcon className="mb-3 size-8 text-muted-foreground" />
            <h3 className="mb-1 font-semibold">Tag Everything</h3>
            <p className="text-muted-foreground text-sm">
              Add tags for easy filtering
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <MagnifyingGlassIcon className="mb-3 size-8 text-muted-foreground" />
            <h3 className="mb-1 font-semibold">Search Instantly</h3>
            <p className="text-muted-foreground text-sm">
              Find what you're looking for
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-lg border bg-muted/50 p-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-2 font-semibold text-2xl">Self-Host It</h2>
            <p className="mb-6 text-muted-foreground">
              KeepStash is open source. Run it on your own infrastructure and
              keep full control of your data.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild variant="outline">
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  to="https://github.com/khaledxyz/keepstash"
                >
                  <GithubLogoIcon className="mr-2" />
                  View on GitHub
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  to="https://github.com/khaledxyz/keepstash#readme"
                >
                  Read Docs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t">
        <div className="container flex flex-wrap items-center justify-between gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-4">
            <Link
              className="flex items-center gap-1.5 hover:text-foreground"
              rel="noopener noreferrer"
              target="_blank"
              to="https://status.khaledxyz.com/status/keepstash"
            >
              <span className="size-2 rounded-full bg-green-500" />
              All Systems Operational
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Link
              className="flex items-center gap-1.5 hover:text-foreground"
              rel="noopener noreferrer"
              target="_blank"
              to="https://github.com/khaledxyz/keepstash"
            >
              <GithubLogoIcon />
              GitHub
            </Link>
            <span>•</span>
            <span>
              Made by{" "}
              <Link
                className="hover:text-foreground"
                rel="noopener noreferrer"
                target="_blank"
                to="https://github.com/khaledxyz"
              >
                khaledxyz
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
