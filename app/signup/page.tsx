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
import { isFormValidate, translateRole } from "@/lib/utils";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Store,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import ar from "react-phone-number-input/locale/ar";
import { signup } from "../actions";
// @ts-expect-error no have types
import { getCitiesByCountry, getCountries } from "country-city-multilanguage";
import { businessTypes } from "@/data";

type CountriesAndCities = {
  label: string;
  label_ar: string;
  label_fr: string;
};
export default function Signup() {
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
    otherBusinessType: "",
  };
  const [userType, setUserType] = useState<"supplier" | "retailer">("supplier");
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const countries: CountriesAndCities[] = getCountries();
  const cities: CountriesAndCities[] = getCitiesByCountry(formData.country);
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line
    const { phone2, confirmPassword, ...reset } = formData;
    // If the other option not choice keep other business type optional
    if (formData.businessType !== "other") {
      // @ts-expect-error ignore warning
      delete reset.otherBusinessType;
    }
    if (!isFormValidate(reset)) {
      return setError("الرجاء إدخال جميع البيانات المطلوبة");
    }

    if (isNaN(Number(formData.commercialIdentityNumber))) {
      if (/^[\u0660-\u0669]+$/.test(formData.commercialIdentityNumber)) {
        return setError("من فضلك أدخل ارقم انجليزيه فقط");
      }
      return setError("من فضلك ادخل ارقام فقط في رقم الهوية");
    }

    if (formData.password.length < 6) {
      return setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("كلمتا المرور غير متطابقتين");
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
      if (errors.code === "23505") {
        return setError("البريد الالكتروني موجود بالفعل");
      }
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
  useEffect(() => {
    updateFormData("businessType", "");
  }, [userType]);

  if (success) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-indigo-100 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-indigo-100 py-8">
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

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xs">
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
                          placeholder="مثال: شركة السلام"
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
                          onValueChange={(value) => {
                            updateFormData("businessType", value);
                            setShowOtherInput(value === "other");
                          }}
                        >
                          <SelectTrigger id="businessType">
                            <SelectValue placeholder="اختر نوع النشاط" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessTypes.map(({ value, label }) => {
                              // translate business type value
                              const trValue =
                                `${translateRole(userType)} - ${value}`.slice(
                                  2
                                );
                              return (
                                <SelectItem
                                  key={value}
                                  value={value === "other" ? value : trValue}
                                >
                                  {value === "other" ? label : trValue}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        {showOtherInput && (
                          <Input
                            id="businessType"
                            placeholder="اكتب نوع النشاط بنفس النمط"
                            value={formData.otherBusinessType || ""}
                            onChange={(e) =>
                              updateFormData(
                                "otherBusinessType",
                                e.target.value
                              )
                            }
                          />
                        )}
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
                        <PhoneInput
                          international
                          defaultCountry="SA"
                          initialValueFormat="national"
                          value={formData.phone}
                          labels={ar}
                          countryCallingCodeEditable={false}
                          onChange={(value) =>
                            updateFormData("phone", value as string)
                          }
                          placeholder="110xxxxxxxx"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone2">
                          هاتف اخر <span className="text-xs">(اختياري)</span>
                        </Label>
                        <Input
                          id="phone2"
                          type="number"
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
                            {countries.map((item, i) => (
                              <SelectItem key={i} value={item.label}>
                                {item.label_ar}
                              </SelectItem>
                            ))}
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
                            {cities.length ? (
                              cities.map((item, i) => (
                                <SelectItem key={i} value={item.label}>
                                  {item.label_ar}
                                </SelectItem>
                              ))
                            ) : (
                              <p className="text-sm text-center py-1">
                                أختار دولة
                              </p>
                            )}
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
