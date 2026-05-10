"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Image from "next/image";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await api.brands.getAll();
      setBrands(res.data?.result || res.data || []);
    } catch (error) {
      toast.error("Failed to load brands");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (editingBrand) {
        await api.brands.update(editingBrand._id, data);
        toast.success("Brand updated successfully");
      } else {
        await api.brands.create(data);
        toast.success("Brand created successfully");
      }
      setIsDialogOpen(false);
      reset();
      setEditingBrand(null);
      fetchBrands();
    } catch (error) {
      toast.error("Failed to save brand");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.brands.delete(id);
      toast.success("Brand deleted");
      fetchBrands();
    } catch (error) {
      toast.error("Failed to delete brand");
    }
  };

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setValue("name", brand.name);
    setValue("logo", brand.logo);
    setValue("description", brand.description);
    setValue("status", brand.status);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Brands</h1>
          <p className="text-sm text-gray-500">
            Manage brands available on your store
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              reset();
              setEditingBrand(null);
            }
          }}
        >
          <DialogTrigger
            render={
              <Button className="bg-[#6366F1] hover:bg-[#4F46E5] gap-2" />
            }
          >
            <Plus className="w-4 h-4" />
            Add Brand
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? "Edit Brand" : "Add Brand"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input
                  {...register("name", { required: true })}
                  placeholder="e.g. Nike"
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  {...register("logo", { required: true })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <textarea
                  {...register("description")}
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
                  rows={3}
                  placeholder="Brand description..."
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  {...register("status")}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5]"
              >
                Save Brand
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-[#D1D5DB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D1D5DB] bg-[#F9FAFB] text-left">
                <th className="py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3.5 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">
                    <Star className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No brands found</p>
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr
                    key={brand._id}
                    className="hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-100 bg-white shrink-0 flex items-center justify-center overflow-hidden p-1">
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            className="max-w-full max-h-full object-contain"
                            width={500}
                            height={400}
                          />
                        </div>
                        <p className="font-medium text-gray-900">
                          {brand.name}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-gray-500 text-xs line-clamp-2 max-w-xs">
                        {brand.description || "-"}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={
                          brand.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {brand.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(brand)}>
                            <Edit className="w-3.5 h-3.5 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(brand._id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
