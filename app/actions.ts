"use server";

import { PATHS } from "@/lib/constants";
import CookieStore from "@/lib/cookies";
import { admin } from "@/lib/supabase/auth-admin";
import { createClient } from "@/lib/supabase/server";
import { translateRole } from "@/lib/utils";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";

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
      message: `هذا الحساب مسجل كـ ${translateRole(
        userData?.user_type
      )}. الرجاء تحديد النوع الصحيح.`,
    };
  }

  switch (formData.userType) {
    case "supplier":
      revalidatePath(PATHS.dashboards.supplier);
      redirect(PATHS.dashboards.supplier);
    case "retailer":
      revalidatePath(PATHS.dashboards.retailer);
      redirect(PATHS.dashboards.retailer);
    case "admin":
      revalidatePath(PATHS.dashboards.admin);
      redirect(PATHS.dashboards.admin);
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
      return profileError;
    }
    redirect(`${PATHS.auth.signin}?email=${userData.email}`);
  }
}

export async function updateUserById(uid: string, updates: any) {
  const res = await admin.from("users").update(updates).eq("id", uid);
  if (res.error) {
    return res;
  }
  await admin.auth.admin.updateUserById(uid, {
    user_metadata: updates,
  });
  return res;
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return error;
  }
  redirect(PATHS.auth.signin);
}

export async function sendEmail({ to, subject, html }: SendEmail) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_SENDER,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: "Commercial Contracts",
    to,
    subject,
    html: `
		<div dir="rtl" class="*:text-right">
			${html}
		</div>
		`,
  });
}

export async function downloadImage(path: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from("avatars").download(path);

  if (error) {
    return { url: null, error };
  }

  return { data, error };
}
