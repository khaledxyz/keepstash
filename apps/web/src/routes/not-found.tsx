import { Link } from "react-router";

import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="grid h-screen w-screen place-items-center bg-background px-4">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="font-bold text-9xl text-muted-foreground">404</h1>
        <h2 className="font-semibold text-3xl">Page not found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button asChild variant="default">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
