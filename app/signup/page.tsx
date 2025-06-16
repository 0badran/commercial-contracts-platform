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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Store,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { signup } from "../actions";

export default function RegisterPage() {
  const initialFormData = {
    commercialName: "",
    commercialIdentityNumber: "",
    businessType: "",
    fullName: "",
    phone: "",
    phone2: "",
    email: "",
    country: "",
    city: "",
    password: "",
    confirmPassword: "",
  };
  const [userType, setUserType] = useState<"supplier" | "retailer">("supplier");
  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isFormValidate = () =>
    formData.commercialName &&
    formData.commercialIdentityNumber &&
    formData.businessType &&
    formData.fullName &&
    formData.phone &&
    formData.email &&
    formData.country &&
    formData.city &&
    formData.password &&
    formData.confirmPassword;

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      return setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }
    if (!isFormValidate()) {
      if (formData.password !== formData.confirmPassword) {
        return setError("كلمتا المرور غير متطابقتين");
      }
      return setError("الرجاء إدخال جميع البيانات المطلوبة");
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    const errors = await signup({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          user_type: userType,
          commercial_name: formData.commercialName,
          commercial_identity_number: formData.commercialIdentityNumber,
          business_type: formData.businessType,
          phone: formData.phone,
          phone2: formData.phone2,
          country: formData.country,
          city: formData.city,
        },
      },
    });
    setLoading(false);

    if (errors) {
      return setError(errors.message || "حدث خطأ أثناء إنشاء الحساب");
    }

    setSuccess(
      "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب."
    );
    setFormData(initialFormData);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              تم إنشاء الحساب بنجاح!
            </h2>
            <p className="text-gray-600 mb-6">{success}</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">تسجيل الدخول</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/register">إنشاء حساب آخر</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة لتسجيل الدخول
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إنشاء حساب جديد
          </h1>
          <p className="text-gray-600">انضم إلى منصة العقود التجارية</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">نوع الحساب</CardTitle>
            <CardDescription className="text-center">
              اختر نوع الحساب المناسب لك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={userType}
              onValueChange={(value) =>
                setUserType(value as "supplier" | "retailer")
              }
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger
                  value="supplier"
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  مورد
                </TabsTrigger>
                <TabsTrigger
                  value="retailer"
                  className="flex items-center gap-2"
                >
                  <Store className="h-4 w-4" />
                  تاجر تجزئة
                </TabsTrigger>
              </TabsList>

              {/* Unified Registration Form */}
              <TabsContent value={userType}>
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Commercial Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      بيانات السجل التجاري
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="commercialName">
                          اسم السجل التجاري *
                        </Label>
                        <Input
                          id="commercialName"
                          value={formData.commercialName}
                          onChange={(e) =>
                            updateFormData("commercialName", e.target.value)
                          }
                          placeholder="أدخل اسم السجل التجاري"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="commercialIdentityNumber">
                          رقم الهوية التجارية *
                        </Label>
                        <Input
                          id="commercialIdentityNumber"
                          value={formData.commercialIdentityNumber}
                          onChange={(e) =>
                            updateFormData(
                              "commercialIdentityNumber",
                              e.target.value
                            )
                          }
                          placeholder="700xxxxxxx"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="businessType">
                          نوع النشاط التجاري *
                        </Label>
                        <Select
                          value={formData.businessType}
                          onValueChange={(value) =>
                            updateFormData("businessType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع النشاط" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retail-food">
                              تجارة تجزئة - مواد غذائية
                            </SelectItem>
                            <SelectItem value="retail-electronics">
                              تجارة تجزئة - أجهزة كهربائية
                            </SelectItem>
                            <SelectItem value="retail-clothing">
                              تجارة تجزئة - ملابس
                            </SelectItem>
                            <SelectItem value="retail-furniture">
                              تجارة تجزئة - أثاث
                            </SelectItem>
                            <SelectItem value="retail-general">
                              تجارة تجزئة - عامة
                            </SelectItem>
                            <SelectItem value="wholesale">
                              تجارة جملة
                            </SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  {/* Contact Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      بيانات التواصل
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم *</Label>
                        <Input
                          id="name"
                          value={formData.fullName}
                          onChange={(e) =>
                            updateFormData("fullName", e.target.value)
                          }
                          placeholder="الاسم الكامل"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            updateFormData("email", e.target.value)
                          }
                          placeholder="example@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">الهاتف *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            updateFormData("phone", e.target.value)
                          }
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone2">
                          هاتف اخر <span className="text-xs">(اختياري)</span>
                        </Label>
                        <Input
                          id="phone2"
                          value={formData.phone2}
                          onChange={(e) =>
                            updateFormData("phone2", e.target.value)
                          }
                          placeholder="011xxxxxxx"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">الدولة *</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) =>
                            updateFormData("country", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الدولة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="saudi-arabia">
                              المملكة العربية السعودية
                            </SelectItem>
                            <SelectItem value="uae">
                              الإمارات العربية المتحدة
                            </SelectItem>
                            <SelectItem value="kuwait">الكويت</SelectItem>
                            <SelectItem value="qatar">قطر</SelectItem>
                            <SelectItem value="bahrain">البحرين</SelectItem>
                            <SelectItem value="oman">عمان</SelectItem>
                            <SelectItem value="jordan">الأردن</SelectItem>
                            <SelectItem value="lebanon">لبنان</SelectItem>
                            <SelectItem value="egypt">مصر</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">المدينة *</Label>
                        <Select
                          value={formData.city}
                          onValueChange={(value) =>
                            updateFormData("city", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المدينة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="riyadh">الرياض</SelectItem>
                            <SelectItem value="jeddah">جدة</SelectItem>
                            <SelectItem value="dammam">الدمام</SelectItem>
                            <SelectItem value="mecca">مكة المكرمة</SelectItem>
                            <SelectItem value="medina">
                              المدينة المنورة
                            </SelectItem>
                            <SelectItem value="khobar">الخبر</SelectItem>
                            <SelectItem value="taif">الطائف</SelectItem>
                            <SelectItem value="tabuk">تبوك</SelectItem>
                            <SelectItem value="abha">أبها</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      كلمة المرور
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">كلمة المرور *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            updateFormData("password", e.target.value)
                          }
                          placeholder="أدخل كلمة مرور قوية"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          تأكيد كلمة المرور *
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            updateFormData("confirmPassword", e.target.value)
                          }
                          placeholder="أعد إدخال كلمة المرور"
                        />
                      </div>
                    </div>
                  </div>
                  {error && <CustomAlert message={error} variant="error" />}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        جاري التسجيل...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        إنشاء حساب {userType === "retailer" ? "تاجر" : "مورد"}
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
