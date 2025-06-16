"use client";
import { signout } from "@/app/actions";
import { Button, ButtonProps } from "../ui/button";

export default function SignoutButton({ ...rest }: ButtonProps) {
  return (
    <Button
      {...rest}
      onClick={() => {
        signout();
      }}
    >
      تسجيل الخروج
    </Button>
  );
}
