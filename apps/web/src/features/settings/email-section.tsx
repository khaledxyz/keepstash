import { EnvelopeIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const EmailSection = () => {
  return (
    <Card>
      <CardContent>
        <FieldSet>
          <FieldLegend className="inline-flex items-center gap-1">
            <EnvelopeIcon />
            <span>Email Address</span>
          </FieldLegend>
          <FieldDescription>
            Change the email address associated with your account. We'll send a
            verification email to your new address.
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Current Email</FieldLabel>
              <Input
                defaultValue="me@khaledxyz.com"
                disabled
                id="email"
                readOnly
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newEmail">New Email</FieldLabel>
              <Input id="newEmail" placeholder="user@keepstash.com" />
            </Field>
            <Field orientation="horizontal">
              <Button type="submit">Update Email</Button>
              <Button type="button" variant="outline">
                Reset
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  );
};
