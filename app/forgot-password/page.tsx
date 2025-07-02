"use client";
import CustomAlert from "@/components/shared/custom-alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { crazyToast } from "@/lib/utils";
import { Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ForgotPassword() {
  const [credentials, setCredentials] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!credentials.email) {
      setError("البريد الإلكتروني مفقود");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(
      credentials.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_ENDPOINT}/reset-password`,
      }
    );
    setLoading(false);
    if (error) {
      return setError("حدث خطا ما حاول مره اخري!");
    }
    setError("");
    crazyToast(
      "تفقد بريدك الالكتروني سيصلك رابط لاعادة تعين كلمة المرور",
      "success"
    );
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-indigo-100 flex-col gap-10 flex items-center justify-center p-4 supports-backdrop-filter:backdrop-blur-xs">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            منصة العقود التجارية
          </h1>
          <p className="text-gray-600">
            نظام إدارة عقود الأجل والمرجع الائتماني
          </p>
        </div>

        <Card className="card-hover shadow-lg border-0 bg-white/80 backdrop-blur-xs">
          <CardHeader>
            <CardTitle className="text-center">نسيت كلمة المرور</CardTitle>
            <CardDescription className="text-center">
              ادخل عنوان البريد الالكتروني
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleForgotPassword}
              method="post"
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل البريد الإلكتروني"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              {error && <CustomAlert message={error} variant="error" />}

              <Button
                className="w-full mt-6 focus-ring btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4 mr-2" />
                )}
                ارسال
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
