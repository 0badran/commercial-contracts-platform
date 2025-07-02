"use server";
import { sendEmail } from "@/app/actions";
import { admin } from "@/lib/supabase/auth-admin";
import { format } from "date-fns";

export async function GET() {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + 1);
  const { data, error, status } = await admin
    .from("contracts")
    .select("*")
    .eq("due_date", format(targetDate, "yyyy-MM-dd"))
    .order("created_at", { ascending: false });

  if (data) {
    const contracts: Database["contract"][] = data;

    await Promise.all(
      contracts.map(async (contract) => {
        const { data: retailer } = await admin
          .from("users")
          .select("*")
          .eq("id", contract.retailer_id)
          .single<Database["user"]>();

        if (!retailer) return;

        await sendEmail({
          to: retailer.email,
          subject: "اشعار دفع",
          html: `
          <div>
            <h1>مرحبا, ${retailer.full_name}</h1>
            <h3>باقي يوم علي الدفع</h3>
            <p>تاريخ استحقاق الدفعه يوم: <strong>${contract.due_date}</strong></p>
            <p>مبلغ الاستحقاق: <strong>${(contract.amount / contract.number_of_payments).toLocaleString()} ر.س</strong></p>
            <p>.فريق عمل منصة العقود يتمني لك النجاح</p>
          </div>
        `,
        });
      })
    );
  }
  if (error) {
    return Response.json(`Something went wrong, ERROR_CODE: ${status}`, {
      status,
    });
  }

  return Response.json(`Everything is OK, CODE: ${status}`, { status });
}
