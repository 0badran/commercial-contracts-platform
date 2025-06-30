"use client";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  emptyCell,
  getCreditRatingColor,
  translateRiskLevel,
} from "@/lib/utils";
import RiskIcon from "../shared/risk-icon";
import { Badge } from "../ui/badge";
import { useContracts } from "@/hooks/use-contracts";

interface SearchUsersInputProps {
  title: string;
  des: string;
  userType: "retailer" | "supplier";
  users: Database["user"][];
  getCreditById: (id: string) => Database["credit_info"] | null;
  setSelectedRetailer: (user: Database["user"] | null) => void;
}

export default function SearchUsersInput({
  title,
  des,
  userType,
  users,
  getCreditById,
  setSelectedRetailer,
}: SearchUsersInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<
    "full_name" | "commercial_identity_number"
  >("full_name");
  const { getCurrentUserContracts } = useContracts();
  const [selectedUser, setSelectedUser] = useState<Database["user"] | null>(
    null
  );
  const { data } = getCurrentUserContracts();
  const filteredUsers = () => {
    return users.filter((user) => {
      if (searchType === "full_name") {
        return user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return user.commercial_identity_number
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    });
  };

  return (
    <>
      <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50 mb-3">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{des}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select
                value={searchType}
                onValueChange={(value) =>
                  setSearchType(
                    value as "full_name" | "commercial_identity_number"
                  )
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="نوع البحث" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_name">الاسم</SelectItem>
                  <SelectItem value="commercial_identity_number">
                    رقم الهويه التجاريه
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={
                    searchType === "full_name"
                      ? `ابحث عن ${
                          { supplier: "المورد", retailer: "التاجر" }[userType]
                        }...`
                      : "أدخل رقم الهويه التجاري..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {filteredUsers().map((retailer) => {
          const creditInfo = getCreditById(retailer.id!);
          const totalContracts = data.filter(
            (c) => c.retailer_id === retailer.id
          ).length;

          return (
            <div
              key={retailer.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedUser?.id === retailer.id
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border hover:border-border/80 hover:bg-accent/50"
              }`}
              onClick={() => {
                setSelectedUser(retailer);
                setSelectedRetailer(retailer);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{retailer.full_name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    عقود {totalContracts} •{" "}
                    {creditInfo?.paid_amount!.toLocaleString()} ر.س
                  </p>
                  <p className="text-xs text-gray-500">
                    رقم السجل: CR-{retailer.commercial_identity_number}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    className={getCreditRatingColor(creditInfo?.credit_rating)}
                  >
                    {creditInfo?.credit_rating || emptyCell}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <RiskIcon risk={creditInfo?.risk_level} />
                    <span className="text-xs">
                      {translateRiskLevel(creditInfo?.risk_level)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredUsers().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>لم يتم العثور على نتائج</p>
          </div>
        )}
      </div>
    </>
  );
}
