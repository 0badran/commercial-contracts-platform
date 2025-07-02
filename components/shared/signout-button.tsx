"use client";
import { signout } from "@/app/actions";
import { Button, ButtonProps } from "../ui/button";
import { useTransition } from "react";

export default function SignoutButton({ ...rest }: ButtonProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      {...rest}
      onClick={() => {
        startTransition(async () => {
          await signout();
        });
      }}
      disabled={isPending}
    >
      تسجيل الخروج
    </Button>
  );
}
