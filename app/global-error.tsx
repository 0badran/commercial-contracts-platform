"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("حدث خطأ:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <div className="flex flex-col items-center gap-4">
            <Bug className="h-16 w-16 text-red-500" />
            <h1 className="text-3xl font-bold text-primary">
              حدث خطأ غير متوقع
            </h1>
            <p className="text-gray-600 max-w-md">
              نأسف! حدث خطأ أثناء تحميل هذه الصفحة في منصة العقود التجارية.
              يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
            </p>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => reset()}>إعادة المحاولة</Button>
              <Button asChild variant="secondary">
                <Link href="/">العودة إلى الصفحة الرئيسية</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
