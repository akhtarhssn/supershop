"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MoreHorizontal, Wrench } from "lucide-react";
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

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await api.services.getAll();
      setServices(res.data?.result || res.data || []);
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (editingService) {
        await api.services.update(editingService._id, data);
        toast.success("Service updated successfully");
      } else {
        await api.services.create(data);
        toast.success("Service created successfully");
      }
      setIsDialogOpen(false);
      reset();
      setEditingService(null);
      fetchServices();
    } catch (error) {
      toast.error("Failed to save service");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.services.delete(id);
      toast.success("Service deleted");
      fetchServices();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setValue("title", service.title);
    setValue("description", service.description);
    setValue("icon", service.icon);
    setValue("status", service.status);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-500">Manage offered services features</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            reset();
            setEditingService(null);
          }
        }}>
          <DialogTrigger render={<Button className="bg-[#6366F1] hover:bg-[#4F46E5] gap-2" />}>
            <Plus className="w-4 h-4" />
            Add Service
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...register("title", { required: true })} placeholder="Service Title" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  {...register("description", { required: true })}
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
                  rows={3}
                  placeholder="Short description..."
                />
              </div>
              <div className="space-y-2">
                <Label>Icon SVG (Code or URL)</Label>
                <Input {...register("icon", { required: true })} placeholder="SVG string or URL" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select {...register("status")} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-[#6366F1] hover:bg-[#4F46E5]">
                Save Service
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
                <th className="py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
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
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">
                    <Wrench className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No services found</p>
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-100 bg-gray-50 shrink-0 flex items-center justify-center text-gray-500 overflow-hidden" dangerouslySetInnerHTML={{ __html: service.icon?.startsWith('<svg') ? service.icon : `<img src="${service.icon}" class="w-full h-full object-cover" />` }} />
                        <p className="font-medium text-gray-900">{service.title}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-gray-500 text-xs line-clamp-2 max-w-sm">{service.description}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className={service.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                        {service.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(service)}>
                            <Edit className="w-3.5 h-3.5 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(service._id)} className="text-red-500 focus:text-red-500">
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
