import { DownloadIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const DataExportSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1">
          <DownloadIcon />
          <span>Data Export</span>
        </CardTitle>
        <CardDescription>
          Download all your data in JSON format. This includes your profile
          information, bookmarks, and all associated data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Export My Data</Button>
      </CardContent>
    </Card>
  );
};
