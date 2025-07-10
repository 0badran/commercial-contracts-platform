import { sendEmail } from "@/app/actions";
import { useUsers } from "@/hooks/use-users";
import { isFormValidate, requestContractTemplate } from "@/lib/utils";
import { Plus, Search, Store } from "lucide-react";
import { FormEvent, useState } from "react";
import CustomAlert from "../shared/custom-alert";
import Spinner from "../shared/spinner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export default function CreateContractDialog({
  createContract,
  refetch,
}: {
  createContract: (Contract: Database["contract"]) => Promise<any>;
  refetch: () => void;
}) {
  const {
    getUsersByType,
    loading: suppliersLoading,
    error: suppliersError,
    currentUser,
    getUserById,
  } = useUsers();
  const initialForm = {
    amount: "",
    paymentTerms: "",
    description: "",
    numberOfPayments: "",
  };
  const [newContract, setNewContract] = useState(initialForm);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [contractsLoading, setContractsLoading] = useState(false);
  const [messages, setMessages] = useState<{
    message: string;
    stats: "error" | "success";
  } | null>(null);
  const suppliers = getUsersByType("supplier");

  const filteredSuppliers = (suppliers: Database["user"][]) =>
    suppliers.filter(
      (supplier) =>
        supplier.commercial_name
          .toLowerCase()
          .includes(supplierSearch.toLowerCase()) ||
        supplier.business_type
          .toLowerCase()
          .includes(supplierSearch.toLowerCase())
    );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { description, ...reset } = newContract;

    if (!isFormValidate(reset)) {
      return setMessages({
        message: "يرجى ملء جميع الحقول المطلوبة.",
        stats: "error",
      });
    }
    setContractsLoading(true);
    const amount = Number(newContract.amount);
    const numberOfPayments = Number(newContract.numberOfPayments);
    const paymentTerms = Number(
      newContract.paymentTerms
    ) as Database["contract"]["payment_terms"];

    const { error } = await createContract({
      supplier_id: selectedSupplierId,
      retailer_id: currentUser?.id as string,
      amount,
      payment_terms: paymentTerms,
      description: description,
      number_of_payments: numberOfPayments,
    });

    setContractsLoading(false);

    if (error) {
      setMessages({ message: "حدث خطأ أثناء إضافة العقد.", stats: "error" });
      return;
    }

    refetch();
    setMessages({
      message: "تم إضافة العقد بنجاح.",
      stats: "success",
    });
    setTimeout(() => {
      setOpen(false);
      setNewContract(initialForm);
      setMessages(null);
    }, 2000);
    const supplier = getUserById(selectedSupplierId);
    const retailer = currentUser?.user_metadata as Database["user"];
    await Promise.all([
      sendEmail({
        to: currentUser?.email || "",
        subject: "طلب تاكيد عقد",
        html: requestContractTemplate({
          name: retailer.full_name,
          role: "retailer",
          receivedCommercialName: supplier?.commercial_name || "",
        }),
      }),
      sendEmail({
        to: supplier?.email || "",
        subject: "طلب تاكيد عقد",
        html: requestContractTemplate({
          name: supplier?.full_name || "",
          receivedCommercialName: retailer.commercial_name,
          role: "supplier",
        }),
      }),
    ]);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        setMessages(null);
      }}
    >
      <DialogTrigger asChild>
        <Button className="text-xs md:text-base px-2">
          <Plus className="h-4 w-4" />
          إضافة عقد جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {messages && (
          <CustomAlert message={messages.message} variant={messages.stats} />
        )}
        <DialogHeader>
          <DialogTitle>إضافة عقد جديد</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل العقد الجديد مع المورد
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="supplier">اختر المورد</label>
              <Select
                value={selectedSupplierId}
                onValueChange={setSelectedSupplierId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المورد" />
                </SelectTrigger>
                <SelectContent>
                  <div className="sticky top-0 bg-white p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="ابحث عن المورد..."
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {(() => {
                    if (suppliersLoading) {
                      return (
                        <CustomAlert
                          message="جاري تحميل الموردين..."
                          variant="success"
                        />
                      );
                    }
                    if (suppliersError) {
                      return (
                        <CustomAlert
                          message="حدوث خطأ أثناء تحميل الموردين"
                          variant="error"
                        />
                      );
                    }
                    if (!getUsersByType("supplier").length) {
                      return <CustomAlert message="لا يوجد موردين مسجلين" />;
                    }
                    return filteredSuppliers(suppliers).map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id!}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <span>{supplier.commercial_name}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              ({supplier.business_type})
                            </span>
                          </div>
                          <div className="flex items-center ml-auto">
                            <Store className="h-3 w-3 text-yellow-500 mr-1" />
                          </div>
                        </div>
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="amount">إجمالي قيمة العقد (ر.س)</label>
                <Input
                  id="amount"
                  type="number"
                  value={newContract.amount}
                  onChange={(e) =>
                    setNewContract({
                      ...newContract,
                      amount: e.target.value,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="numberOfPayments">عدد الدفعات</label>
                <Input
                  id="numberOfPayments"
                  type="number"
                  value={newContract.numberOfPayments}
                  onChange={(e) =>
                    setNewContract({
                      ...newContract,
                      numberOfPayments: e.target.value,
                    })
                  }
                  placeholder="مثال: 6"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="paymentTerms">شروط الدفع</label>
              <Select
                value={newContract.paymentTerms}
                onValueChange={(value) =>
                  setNewContract({ ...newContract, paymentTerms: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر شروط الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"15"}>كل 15 يوم</SelectItem>
                  <SelectItem value={"30"}>كل 30 يوم</SelectItem>
                  <SelectItem value={"45"}>كل 45 يوم</SelectItem>
                  <SelectItem value={"60"}>كل 60 يوم</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description">وصف العقد</label>
              <Textarea
                id="description"
                value={newContract.description}
                onChange={(e) =>
                  setNewContract({
                    ...newContract,
                    description: e.target.value,
                  })
                }
                placeholder="وصف مختصر للعقد والخدمات المقدمة"
              />
            </div>

            {/* Payment Preview */}
            {newContract.amount &&
            newContract.numberOfPayments &&
            !isNaN(Number(newContract.amount)) &&
            !isNaN(Number(newContract.numberOfPayments)) &&
            Number(newContract.numberOfPayments) > 0 ? (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  معاينة الدفعات
                </h4>
                <div className="text-sm text-blue-800">
                  <p>
                    قيمة كل دفعة:{" "}
                    <span className="font-bold">
                      {(
                        Number(newContract.amount) /
                        Number(newContract.numberOfPayments)
                      ).toLocaleString()}{" "}
                      ر.س
                    </span>
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button disabled={contractsLoading} type="submit">
              {contractsLoading ? <Spinner /> : null}
              إضافة العقد
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
