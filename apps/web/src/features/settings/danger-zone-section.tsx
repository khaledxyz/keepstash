import { TrashIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const DangerZoneSection = () => {
  return (
    <Card className="ring-red-500/50">
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1 text-red-600">
          <TrashIcon />
          <span>Danger Zone</span>
        </CardTitle>
        <CardDescription>
          Once you delete your account, there is no going back. This action is
          permanent and cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive">Delete Account</Button>
      </CardContent>
    </Card>
  );
};
