"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { customers } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  inactive: "bg-gray-50 text-gray-600 border-gray-200",
  blocked: "bg-red-50 text-red-700 border-red-200",
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">{customers.length} registered customers</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: customers.length, color: "text-[#6366F1]" },
          { label: "Active", value: customers.filter((c) => c.status === "active").length, color: "text-[#4baf4f]" },
          { label: "Avg. Spent", value: formatPrice(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length), color: "text-[#fbb400]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-[#D1D5DB] p-4 text-center">
            <p className={cn("text-2xl font-extrabold", stat.color)}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-9 text-sm border-[#D1D5DB]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#D1D5DB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D1D5DB] bg-[#F9FAFB]">
                {["Customer", "Contact", "Orders", "Total Spent", "Joined", "Status", ""].map((h) => (
                  <th key={h} className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback className="text-xs">
                          {customer.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-gray-900 text-xs">{customer.name}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-xs text-gray-600 flex items-center gap-1 mb-0.5">
                      <Mail className="w-3 h-3" />
                      {customer.email}
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {customer.phone}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-gray-900 text-xs">
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#6366F1] text-sm">
                      {formatPrice(customer.totalSpent)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500">
                    {formatDate(customer.joinedAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant="outline"
                      className={cn("capitalize text-[10px] border", statusColors[customer.status])}
                    >
                      {customer.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Orders</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Block Customer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
