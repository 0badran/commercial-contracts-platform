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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  CircleCheck,
  Loader2,
  LogIn,
  Shield,
  Store,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, use, useState } from "react";
import { signin } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  const { email } = use(searchParams);
  const [userType, setUserType] = useState<UserType>("supplier");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValidate = () => credentials.email && credentials.password;

    if (!isFormValidate()) {
      setError("البريد الإلكتروني أو الهاتف مفقود");
      return;
    }
    setError(null);
    setLoading(true);

    const formData = { ...credentials, userType };
    const { message } = await signin(formData);
    setLoading(false);
    if (message) {
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-indigo-100 flex-col gap-10 flex items-center justify-center p-4 supports-backdrop-filter:backdrop-blur-xs">
      {email && (
        <div className="max-w-lg">
          <CustomAlert
            message={`تم تسجيل حاسبك وستصلك رسالة علي ${email} لتأكيد الحساب`}
            Icon={CircleCheck}
          />
        </div>
      )}
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
            <CardTitle className="text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              اختر نوع المستخدم وسجل دخولك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={userType}
              onValueChange={(value) => setUserType(value as UserType)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="supplier"
                  className="flex items-center gap-1 text-xs"
                >
                  <Building2 className="h-3 w-3" />
                  مورد
                </TabsTrigger>
                <TabsTrigger
                  value="retailer"
                  className="flex items-center gap-1 text-xs"
                >
                  <Store className="h-3 w-3" />
                  تاجر
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="flex items-center gap-1 text-xs"
                >
                  <Shield className="h-3 w-3" />
                  مدير
                </TabsTrigger>
              </TabsList>

              <TabsContent value={userType} className="mt-4">
                <form
                  onSubmit={handleLogin}
                  method="post"
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="supplier-email">البريد الإلكتروني</Label>
                    <Input
                      id="supplier-email"
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
                  <div className="space-y-2">
                    <Label htmlFor="supplier-password">كلمة المرور</Label>
                    <Input
                      id="supplier-password"
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
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
                    {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                  </Button>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      ليس لديك حساب؟{" "}
                      <Link
                        href="/signup"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        إنشاء حساب جديد
                      </Link>
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
