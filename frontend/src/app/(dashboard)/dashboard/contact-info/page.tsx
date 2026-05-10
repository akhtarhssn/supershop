"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useForm } from "react-hook-form";
import Facebook from "@/components/icons/facebook";
import Twitter from "@/components/icons/twitter";
import Instagram from "@/components/icons/instagram";
import Linkedin from "@/components/icons/linkedin";

export default function ContactInfoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await api.contactInfo.get();
        if (res.data) {
          reset(res.data);
        }
      } catch (error) {
        toast.error("Failed to load contact info");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactInfo();
  }, [reset]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await api.contactInfo.update(data);
      toast.success("Contact Information updated successfully");
    } catch (error) {
      toast.error("Failed to update contact information");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Contact Information</h1>
        <p className="text-sm text-gray-500">Manage the global contact details shown on the storefront</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#D1D5DB] p-6 space-y-6">
          <h3 className="font-bold text-gray-900">Primary Details</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> Email Address
              </Label>
              <Input {...register("email", { required: true })} placeholder="contact@example.com" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> Phone Number
              </Label>
              <Input {...register("phone", { required: true })} placeholder="+1 234 567 8900" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Physical Address
              </Label>
              <Input {...register("address", { required: true })} placeholder="123 Store St, City, Country" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#D1D5DB] p-6 space-y-6">
          <h3 className="font-bold text-gray-900">Social Media Links</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-[#1877F2]" /> Facebook URL
              </Label>
              <Input {...register("facebook")} placeholder="https://facebook.com/yourpage" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Twitter className="w-4 h-4 text-[#1DA1F2]" /> Twitter URL
              </Label>
              <Input {...register("twitter")} placeholder="https://twitter.com/yourpage" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[#E4405F]" /> Instagram URL
              </Label>
              <Input {...register("instagram")} placeholder="https://instagram.com/yourpage" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-[#0A66C2]" /> LinkedIn URL
              </Label>
              <Input {...register("linkedin")} placeholder="https://linkedin.com/company/yourpage" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#6366F1] hover:bg-[#4F46E5] gap-2 px-8"
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
