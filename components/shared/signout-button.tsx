"use client";
import { signout } from "@/app/actions";
import { useTransition } from "react";
import { Button, ButtonProps } from "../ui/button";

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
