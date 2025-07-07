"use client";
import { updateUserById } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";
import { crazyToast } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { Image as ImgLucide, LoaderCircle } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserAvatar({ user }: { user: User }) {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function downloadImage(path: string) {
      const { data, error: downloadError } = await supabase.storage
        .from("avatars")
        .download(path);

      if (downloadError) {
        return setError("حدث خطا اثناء تنزيل الصوره");
      }

      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    }
    const userAvatar = user.user_metadata.avatar_url as string;
    if (userAvatar) {
      downloadImage(userAvatar);
    }
  }, [user, supabase]);

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
  }

  const [first] = user.user_metadata.full_name.split(" ");

  return (
    <>
      <Avatar className="size-30 mx-auto relative overflow-hidden">
        <AvatarImage className="object-cover" src={avatarUrl} />
        <AvatarFallback>{first.slice(0, 2)}</AvatarFallback>
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
