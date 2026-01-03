import { Logo } from "./logo";

export function LoadingScreen() {
  return (
    <div className="absolute top-0 left-0 grid h-screen w-screen place-items-center bg-background">
      <Logo className="[&>svg]:animate-spin" />
    </div>
  );
}
