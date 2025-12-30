import { LockKeyIcon } from "@phosphor-icons/react";

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

export const PasswordSection = () => {
  return (
    <Card>
      <CardContent>
        <FieldSet>
          <FieldLegend className="inline-flex items-center gap-1">
            <LockKeyIcon />
            <span>Password</span>
          </FieldLegend>
          <FieldDescription>
            Update your password to keep your account secure. Make sure to use a
            strong password.
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="currentPassword">
                Current Password
              </FieldLabel>
              <Input id="currentPassword" type="password" />
            </Field>
            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <Input id="newPassword" type="password" />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm New Password
              </FieldLabel>
              <Input id="confirmPassword" type="password" />
            </Field>
            <Field orientation="horizontal">
              <Button type="submit">Update Password</Button>
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
