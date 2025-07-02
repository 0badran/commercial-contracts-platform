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
import { Loader2, LockOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ResetPassword() {
  const [credentials, setCredentials] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!credentials.password) {
      return setError("كلمة المرور مفقوده");
    }

    if (credentials.password !== credentials.confirmPassword) {
      return setError("كلمة المرور غير متطابقه");
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: credentials.password,
    });
    setLoading(false);
    if (error) {
      return setError("حدث خطا ما حاول مره اخري!: " + error.message);
    }
    setError("");
    crazyToast("تم اعادة تعين كلمة المرور بنجاح", "success");
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
            <CardTitle className="text-center">
              اعادة تعين كلمة المرور
            </CardTitle>
            <CardDescription className="text-center">
              ادخل كلمة المرور
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleResetPassword}
              method="post"
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="password">ادخل كلمة المرور الجديد</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="ادخل كلمة المرور الجديد"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  تاكيد كلمة المرور الجديد
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="تاكيد كلمة المرور الجديد"
                  value={credentials.confirmPassword}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      confirmPassword: e.target.value,
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
                  <LockOpen className="h-4 w-4 mr-2" />
                )}
                تغير كلمة المرور
              </Button>
              <Link
                href="/"
                className="text-blue-600 underline hover:text-blue-700"
              >
                تسجيل الدخول
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
