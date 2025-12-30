import { PlusIcon, TrashIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

const keys = [
  {
    id: 1,
    name: "Instagram",
    created: "2024-01-15",
    lastUsed: "2 hours ago",
  },
  {
    id: 2,
    name: "Bots",
    created: "2024-01-10",
    lastUsed: "1 day ago",
  },
  {
    id: 3,
    name: "Mobile app",
    created: "2024-01-05",
    lastUsed: "Never",
  },
];

export const ApiKeysSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API keys</CardTitle>
        <CardDescription>
          Manage your API keys for accessing the platform. Keep your keys secure
          and never share them publicly.
        </CardDescription>
        <CardAction>
          <Button>
            <PlusIcon weight="bold" />
            <span>New API key</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {keys.map((key) => (
            <Item key={key.id} variant="outline">
              <ItemContent>
                <ItemTitle>Production Key</ItemTitle>
                <ItemDescription>
                  Created on {key.created} • Last used {key.lastUsed}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm" variant="destructive">
                  <TrashIcon />
                  <span>Revoke</span>
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
};
