import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";

import { AuthCard } from "@/features/auth/components/auth-card";
import { EmailField } from "@/features/auth/components/email-field";
import { PasswordField } from "@/features/auth/components/password-field";

export function LoginPage() {
  function handleLogin() {
    console.log("Login submitted");
  }

  return (
    <AuthCard title="Welcome back">
      <CardContent>
        <FieldGroup>
          <EmailField />
          <PasswordField />
          <Field>
            <Button onClick={handleLogin} type="submit">
              Login
            </Button>
          </Field>
        </FieldGroup>
      </CardContent>

      <CardFooter className="inline-flex justify-center">
        <p>
          Don't have an account?{" "}
          <Link className="underline" to="/register">
            Register
          </Link>
        </p>
      </CardFooter>
    </AuthCard>
  );
}
