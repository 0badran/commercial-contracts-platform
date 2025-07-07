import SignupForm from "@/components/shared/signup-form";
import UserAvatar from "@/components/shared/user-avatar";
import getUser from "@/services/get-user";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Profile() {
  const { user } = await getUser();

  if (!user) {
    redirect("/");
  }
  const userData = user.user_metadata as Database["user"];
  return (
    <div className="max-w-md m-auto mt-7 space-y-5">
      <Link
        href={`/dashboards/${userData.user_type}_dashboard`}
        className="hover:underline absolute left-1/12 top-10 text-xl sm:text-2xl"
      >
        خروج
      </Link>
      <UserAvatar user={user} />
      <SignupForm userType="retailer" userId={user?.id} />
    </div>
  );
}
