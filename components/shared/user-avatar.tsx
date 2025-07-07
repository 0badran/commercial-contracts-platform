"use client";
import { downloadImage, updateUserById } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";
import { crazyToast } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { Image as ImgLucide, LoaderCircle } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

export default function UserAvatar({ user }: { user: User }) {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const userAvatar = user.user_metadata.avatar_url as string;
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

  async function handleUserAvatar(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return setError("You must select an image to upload.");
    }
    setUploading(true);
    setError(null);
    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

    const [{ error: uploadError }, { error: updateAvatarError }] =
      await Promise.all([
        supabase.storage.from("avatars").upload(filePath, file),
        updateUserById(user?.id as string, {
          avatar_url: filePath,
        }),
      ]);

    setUploading(false);

    if (uploadError || updateAvatarError) {
      return setError("فشل في رفع الصورة");
    }
    crazyToast("تم رفع الصورة", "success");
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    queryClient.invalidateQueries({ queryKey: ["user"] });
  }

  const [first] = user.user_metadata.full_name.split(" ");

  return (
    <>
      <Avatar className="size-30 mx-auto relative overflow-hidden">
        {avatarLoading ? (
          <Skeleton className="size-30 rounded-full" />
        ) : (
          <>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{first.slice(0, 2)}</AvatarFallback>
          </>
        )}
        <label
          htmlFor="single"
          className={`${uploading ? "cursor-default" : "cursor-pointer"} absolute z-1 text-center justify-center pt-2 text-white gap-1 text-xs flex bg-black/80 w-full h-1/3 bottom-0`}
        >
          {uploading ? (
            <>
              جاري التحميل...
              <LoaderCircle className="animate-spin" size={14} />
            </>
          ) : (
            <>
              تحميل صوره
              <ImgLucide size={16} />
            </>
          )}
        </label>
      </Avatar>
      <input
        type="file"
        onChange={handleUserAvatar}
        disabled={uploading}
        className="hidden"
        accept="image/*"
        id="single"
      />
      {error && <p className="text-destructive text-sm text-center">{error}</p>}
    </>
  );
}
