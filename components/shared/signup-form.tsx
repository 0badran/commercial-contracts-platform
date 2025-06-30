"use client";
import { FormEvent, useState } from "react";

import { signup, updateUserById } from "@/app/actions";
import CustomAlert from "@/components/shared/custom-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/hooks/use-users";
import { isFormValidate, translateRole } from "@/lib/utils";
import { CheckCircle, Edit, UserPlus } from "lucide-react";

export default function SignupForm({
  userId,
  userType,
}: {
  userId?: string | null;
  userType: Database["user"]["user_type"];
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { getUserById } = useUsers();

  const user = getUserById(userId!);

  const initialFormData = {
    commercialName: user?.commercial_name || "",
    commercialIdentityNumber: user?.commercial_identity_number || "",
    businessType: user?.business_type || "",
    fullName: user?.full_name || "",
    phone: user?.phone || "",
    phone2: user?.phone2 || "",
    email: user?.email || "",
    country: user?.country || "",
    city: user?.city || "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      if (!isFormValidate(formData)) {
        return setError("الرجاء إدخال جميع البيانات المطلوبة");
      }
      if (formData.password !== formData.confirmPassword) {
        return setError("كلمتا المرور غير متطابقتين");
      }
      if (formData.password.length < 6) {
        return setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      }
    } else {
      // eslint-disable-next-line
      const { email, confirmPassword, phone2, password, ...reset } = formData;
      if (!isFormValidate(reset)) {
        return setError("لايمكن ترك حقول فارغه");
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    if (userId) {
      const { error } = await updateUserById(userId, {
        user_metadata: {
          full_name: formData.fullName,
          commercial_name: formData.commercialName,
          commercial_identity_number: formData.commercialIdentityNumber,
          business_type: formData.businessType,
          phone: formData.phone,
          phone2: formData.phone2,
          country: formData.country,
          city: formData.city,
        },
      });
      if (error) {
        return setError(
          `حدث خطا اثناء تحديث بيانات ${translateRole(userType)}`
        );
      }
      return setSuccess("تم تحديث بيانات " + translateRole(userType));
    }
    const error = await signup({
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
    if (error) {
      setError(error.message || "حدث خطا في انشاء الحساب");
    }
    setSuccess(
      "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب."
    );
    setFormData(initialFormData);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">{success}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <form onSubmit={handleRegister} className="space-y-6">
      {/* Commercial Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          بيانات السجل التجاري
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="commercialName">اسم السجل التجاري *</Label>
            <Input
              id="commercialName"
              value={formData.commercialName}
              onChange={(e) => updateFormData("commercialName", e.target.value)}
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
                updateFormData("commercialIdentityNumber", e.target.value)
              }
              placeholder="700xxxxxxx"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="businessType">نوع النشاط التجاري *</Label>
            <Select
              value={formData.businessType}
              onValueChange={(value) => updateFormData("businessType", value)}
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
                <SelectItem value="wholesale">تجارة جملة</SelectItem>
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
              onChange={(e) => updateFormData("fullName", e.target.value)}
              placeholder="الاسم الكامل"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              disabled={!!userId}
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              placeholder="example@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">الهاتف *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
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
              onChange={(e) => updateFormData("phone2", e.target.value)}
              placeholder="011xxxxxxx"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">الدولة *</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => updateFormData("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الدولة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saudi-arabia">
                  المملكة العربية السعودية
                </SelectItem>
                <SelectItem value="uae">الإمارات العربية المتحدة</SelectItem>
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
              onValueChange={(value) => updateFormData("city", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الرياض">الرياض</SelectItem>
                <SelectItem value="jeddah">جدة</SelectItem>
                <SelectItem value="الدمام">الدمام</SelectItem>
                <SelectItem value="mecca">مكة المكرمة</SelectItem>
                <SelectItem value="medina">المدينة المنورة</SelectItem>
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
      {userId ? (
        <div className="space-y-2">
          <Label htmlFor="password">تغير كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            placeholder="أدخل كلمة مرور قوية"
          />
        </div>
      ) : (
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
                onChange={(e) => updateFormData("password", e.target.value)}
                placeholder="أدخل كلمة مرور قوية"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
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
      )}
      {error && <CustomAlert message={error} variant="error" />}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {userId ? "جاري الحفظ..." : "جاري التسجيل..."}
          </>
        ) : userId ? (
          <>
            <Edit className="h-4 w-4 mr-2" />
            حفظ البيانات
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            إنشاء حساب {userType === "retailer" ? "تاجر" : "مورد"}
          </>
        )}
      </Button>
    </form>
  );
}
