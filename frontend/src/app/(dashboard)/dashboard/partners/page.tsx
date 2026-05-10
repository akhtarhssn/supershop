"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MoreHorizontal, Briefcase } from "lucide-react";
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

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const res = await api.partners.getAll();
      setPartners(res.data?.result || res.data || []);
    } catch (error) {
      toast.error("Failed to load partners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (editingPartner) {
        await api.partners.update(editingPartner._id, data);
        toast.success("Partner updated successfully");
      } else {
        await api.partners.create(data);
        toast.success("Partner created successfully");
      }
      setIsDialogOpen(false);
      reset();
      setEditingPartner(null);
      fetchPartners();
    } catch (error) {
      toast.error("Failed to save partner");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.partners.delete(id);
      toast.success("Partner deleted");
      fetchPartners();
    } catch (error) {
      toast.error("Failed to delete partner");
    }
  };

  const handleEdit = (partner: any) => {
    setEditingPartner(partner);
    setValue("name", partner.name);
    setValue("logo", partner.logo);
    setValue("website", partner.website);
    setValue("status", partner.status);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Partners</h1>
          <p className="text-sm text-gray-500">Manage your business partners</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            reset();
            setEditingPartner(null);
          }
        }}>
          <DialogTrigger render={<Button className="bg-[#6366F1] hover:bg-[#4F46E5] gap-2" />}>
            <Plus className="w-4 h-4" />
            Add Partner
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...register("name", { required: true })} placeholder="Partner Name" />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input {...register("logo", { required: true })} placeholder="https://example.com/logo.png" />
              </div>
              <div className="space-y-2">
                <Label>Website (Optional)</Label>
                <Input {...register("website")} placeholder="https://example.com" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select {...register("status")} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-[#6366F1] hover:bg-[#4F46E5]">
                Save Partner
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
                <th className="py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Partner</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Website</th>
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
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">
                    <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No partners found</p>
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner._id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-100 overflow-hidden bg-white shrink-0 flex items-center justify-center p-1">
                          <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <p className="font-medium text-gray-900">{partner.name}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {partner.website ? (
                        <a href={partner.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          {partner.website}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className={partner.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                        {partner.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(partner)}>
                            <Edit className="w-3.5 h-3.5 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(partner._id)} className="text-red-500 focus:text-red-500">
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
