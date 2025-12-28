import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";

import { AuthCard } from "@/features/auth/components/auth-card";
import { EmailField } from "@/features/auth/components/email-field";
import { PasswordField } from "@/features/auth/components/password-field";

export function RegisterPage() {
  function handleRegister() {
    console.log("Register submitted");
  }

  return (
    <AuthCard title="Create your account">
      <CardContent>
        <FieldGroup>
          <EmailField />
          <PasswordField />
          <Field>
            <Button onClick={handleRegister} type="submit">
              Register
            </Button>
          </Field>
        </FieldGroup>
      </CardContent>

      <CardFooter className="inline-flex justify-center">
        <p>
          Already have an account?{" "}
          <Link className="underline" to="/login">
            Login
          </Link>
        </p>
      </CardFooter>
    </AuthCard>
  );
}
