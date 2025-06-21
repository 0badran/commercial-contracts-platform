"use client";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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

interface SearchUsersInputProps {
  title: string;
  des: string;
  userType: "retailer" | "supplier";
  users: Database["user"][];
  setUsers: (users: Database["user"][]) => void;
}

export default function SearchUsersInput({
  title,
  des,
  userType,
  users,
  setUsers,
}: SearchUsersInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<
    "full_name" | "commercial_identity_number"
  >("full_name");

  const filteredUsers = useCallback(() => {
    return users.filter((user) => {
      if (searchType === "full_name") {
        return user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return user.commercial_identity_number
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    });
    // eslint-disable-next-line
  }, [searchTerm, searchType]);

  useEffect(() => {
    setUsers(filteredUsers());
  }, [filteredUsers, setUsers]);

  return (
    <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
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
  );
}
