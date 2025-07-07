"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useTransition } from "react";
import { signout } from "@/app/actions";
import { usePathname } from "next/navigation";
import useUser from "@/hooks/use-user";
import { Skeleton } from "../ui/skeleton";
import Error from "next/error";

export default function ProfileDropdown() {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const { user, loading } = useUser();
  if (loading) {
    return (
      <div className="flex gap-1 items-center">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="w-20 h-4" />
      </div>
    );
  }

  const userData = user?.user_metadata as Database["user"];
  if (!userData) {
    return <Error statusCode={401} title="حدث خطا اثناء جلب المستخدم" />;
  }
  const [first] = userData.full_name.split(" ");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="cursor-pointer disabled:brightness-50 disabled:cursor-not-allowed flex gap-1 items-center"
      >
        <Avatar>
          <AvatarImage src={userData.avatar_url} />
          <AvatarFallback>{first.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <span>مرحبا, {first}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`${pathname}/profile`}>الملف الشخصي</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:bg-red-50 focus:text-destructive cursor-pointer"
          onClick={() => {
            startTransition(async () => {
              await signout();
            });
          }}
          disabled={isPending}
        >
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
