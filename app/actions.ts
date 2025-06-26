"use server";

import paths from "@/data/paths";
import CookieStore from "@/lib/cookies";
import { createClient } from "@/lib/supabase/server";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const translateUserType = (type: string): string => {
  switch (type) {
    case "supplier":
      return "مورد";
    case "retailer":
      return "تاجر";
    case "admin":
      return "مدير";
    default:
      return type;
  }
};

export async function signin(formData: {
  email: string;
  password: string;
  userType: UserType;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    switch (error.code) {
      case "invalid_credentials":
        return { message: "بيانات اعتماد تسجيل الدخول غير صالحة" };
      case "email_not_confirmed":
        return { message: "لم يتم تأكيد البريد الإلكتروني" };
    }
    return { message: `خطأ في تسجيل الدخول: ${error.message}` };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("user_type")
    .eq("id", data.user.id)
    .single();
  if (userData?.user_type !== formData.userType) {
    const cookieStore = new CookieStore();
    cookieStore.delete("sb-zcbncnlhopnjihiqvxtl-auth-token");
    return {
      message: `هذا الحساب مسجل كـ ${translateUserType(
        userData?.user_type
      )}. الرجاء تحديد النوع الصحيح.`,
    };
  }

  switch (formData.userType) {
    case "supplier":
      revalidatePath(paths.dashboards.supplier);
      redirect(paths.dashboards.supplier);
    case "retailer":
      revalidatePath(paths.dashboards.retailer);
      redirect(paths.dashboards.retailer);
    case "admin":
      revalidatePath(paths.dashboards.admin);
      redirect(paths.dashboards.admin);
  }
}

export async function signup(data: SignUpWithPasswordCredentials) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp(data);

  if (error) {
    return error;
  }

  const userData = user?.user_metadata as Database["user"];

  if (user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      full_name: userData.full_name,
      user_type: userData.user_type,
      commercial_name: userData.commercial_name,
      commercial_identity_number: userData.commercial_identity_number,
      business_type: userData.business_type,
      phone: userData.phone,
      phone2: userData.phone2,
      country: userData.country,
      city: userData.city,
    });

    if (profileError) {
      if (profileError.details.includes("already exists.")) {
        return new Error("هذا البريد الإلكتروني مسجل مسبقاً");
      }
      return new Error(`Profile creation error: ${profileError.message}`);
    }
    redirect(`${paths.auth.signin}?email=${userData.email}`);
  }
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return error;
  }
  redirect(paths.auth.signin);
}
