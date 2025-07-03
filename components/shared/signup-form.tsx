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
import PhoneInput from "react-phone-number-input";
import ar from "react-phone-number-input/locale/ar";
import { getCitiesByCountry, getCountries } from "country-city-multilanguage";

type CountriesAndCities = {
  label: string;
  label_ar: string;
  label_fr: string;
};

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
  const [showOtherInput, setShowOtherInput] = useState(false);

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
    otherBusinessType: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const countries: CountriesAndCities[] = getCountries();
  const cities: CountriesAndCities[] = getCitiesByCountry(formData.country);
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // eslint-disable-next-line
    const { email, confirmPassword, phone2, password, ...reset } = formData;
    if (!userId) {
      if (!isFormValidate({ email, ...reset })) {
        return setError("الرجاء إدخال جميع البيانات المطلوبة");
      }
      if (isNaN(Number(formData.commercialIdentityNumber))) {
        return setError("من فضلك ادخل ارقام فقط في رقم الهوية");
      }
      if (password.length < 6) {
        return setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      }
      if (password !== confirmPassword) {
        return setError("كلمتا المرور غير متطابقتين");
      }
    } else {
      if (!isFormValidate(reset)) {
        return setError("لايمكن ترك حقول فارغه");
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    const businessType =
      formData.businessType === "other"
        ? formData.otherBusinessType
        : formData.businessType;

    if (userId) {
      const { error } = await updateUserById(userId, {
        full_name: formData.fullName,
        commercial_name: formData.commercialName,
        commercial_identity_number: formData.commercialIdentityNumber,
        business_type: businessType,
        phone: formData.phone,
        phone2: formData.phone2,
        country: formData.country,
        city: formData.city,
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
      return setError(error.message || "حدث خطا في انشاء الحساب");
    }
    setSuccess(
      "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب."
    );
    setFormData(initialFormData);
  };

  if (success) {
    return (
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">{success}</p>
        </CardContent>
      </Card>
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
              onValueChange={(value) => {
                updateFormData("businessType", value);
                setShowOtherInput(value === "other");
              }}
            >
              <SelectTrigger id="businessType">
                <SelectValue placeholder="اختر نوع النشاط" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="مواد غذائية">مواد غذائية</SelectItem>
                <SelectItem value="أجهزة كهربائية">أجهزة كهربائية</SelectItem>
                <SelectItem value="ملابس">ملابس</SelectItem>
                <SelectItem value="أثاث">أثاث</SelectItem>
                <SelectItem value="عامة">عامة</SelectItem>
                <SelectItem value="جملة">جملة</SelectItem>
                {userId && formData.businessType !== "other" && (
                  <SelectItem value={formData.businessType}>
                    {formData.businessType}
                  </SelectItem>
                )}
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>

            {showOtherInput && (
              <Input
                id="businessType"
                placeholder="اكتب نوع النشاط بنفس النمط"
                value={formData.otherBusinessType || ""}
                onChange={(e) =>
                  updateFormData("otherBusinessType", e.target.value)
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
            <PhoneInput
              international
              defaultCountry="SA"
              initialValueFormat="national"
              value={formData.phone}
              labels={ar}
              countryCallingCodeEditable={false}
              onChange={(value) => updateFormData("phone", value as string)}
              placeholder="110xxxxxxxx"
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
              onValueChange={(value) => updateFormData("city", value)}
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
                  <p className="text-sm text-center py-1">أختار دولة</p>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Password Section */}
      {!userId && (
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
