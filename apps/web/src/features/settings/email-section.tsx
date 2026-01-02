import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const emailSchema = z.object({
  newEmail: z.email("Please enter a valid email address."),
});

type EmailFormData = z.infer<typeof emailSchema>;

export const EmailSection = () => {
  const { data: session } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  async function onSubmit(data: EmailFormData) {
    setIsLoading(true);
    try {
      await authClient.changeEmail({
        newEmail: data.newEmail,
        callbackURL: window.location.origin,
      });

      toast.success("Verification email sent!", {
        description:
          "Please check your inbox to verify your new email address.",
      });

      form.reset();
    } catch (error) {
      toast.error("Failed to update email", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <form id="email-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldLegend className="inline-flex items-center gap-1">
              <EnvelopeIcon />
              <span>Email Address</span>
            </FieldLegend>
            <FieldDescription>
              Change the email address associated with your account. We'll send
              a verification email to your new address.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Current Email</FieldLabel>
                <Input
                  defaultValue={session?.user?.email || ""}
                  disabled
                  id="email"
                  readOnly
                />
              </Field>
              <Controller
                control={form.control}
                name="newEmail"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="newEmail">New Email</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="newEmail"
                      placeholder="user@keepstash.com"
                      type="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field orientation="horizontal">
                <Button disabled={isLoading} form="email-form" type="submit">
                  {isLoading ? "Updating..." : "Update Email"}
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={() => form.reset()}
                  type="button"
                  variant="outline"
                >
                  Reset
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};
