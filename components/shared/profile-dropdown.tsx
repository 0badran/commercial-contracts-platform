"use client";
import { downloadImage, signout } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUser from "@/hooks/use-user";
import Error from "next/error";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "../ui/skeleton";

export default function ProfileDropdown() {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const { user, loading } = useUser();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    const userAvatar = user?.user_metadata.avatar_url as string;
    if (userAvatar) {
      (async () => {
        setAvatarLoading(true);
        const { data, error } = await downloadImage(userAvatar);
        setAvatarLoading(false);
        if (error) {
          return;
        }
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      })();
    }
  }, [user]);

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
          {avatarLoading ? (
            <Skeleton className="size-10 rounded-full" />
          ) : (
            <>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{first.slice(0, 2)}</AvatarFallback>
            </>
          )}
        </Avatar>

        <span>مرحباً بك {first}</span>
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
