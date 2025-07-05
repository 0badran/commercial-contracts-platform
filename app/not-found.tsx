// app/not-found.tsx

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h1 className="text-3xl font-bold text-primary">الصفحة غير موجودة</h1>
        <p className="text-gray-600 max-w-md">
          يبدو أنك تحاول الوصول إلى صفحة غير موجودة في منصة العقود التجارية.
          تأكد من الرابط أو عُد إلى الصفحة الرئيسية.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">العودة إلى الصفحة الرئيسية</Link>
        </Button>
      </div>
    </div>
  );
}
