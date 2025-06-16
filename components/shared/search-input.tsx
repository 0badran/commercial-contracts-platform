"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchInputProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function SearchInput({ placeholder, value, onChange, className = "max-w-sm" }: SearchInputProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Search className="h-4 w-4 text-gray-400" />
      <Input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
