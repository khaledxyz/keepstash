import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function EmailField() {
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        id="email"
        name="email"
        placeholder="user@keepstash.io"
        type="email"
      />
    </Field>
  );
}
