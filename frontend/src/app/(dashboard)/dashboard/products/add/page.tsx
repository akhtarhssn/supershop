"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Upload, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useCreateProductMutation } from "@/redux/api/productApi";
import { ICategory } from "@/types/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function AddProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // RTK Query hooks
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const categories = categoriesResponse?.data || [];
  const selectedCategoryObj = categories.find(
    (c) => c._id === selectedCategory,
  );

  console.log({ selectedCategory });

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  // create slug from name
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: selectedCategory,
      brand: formData.get("brand"),
      price: Number(formData.get("price")),
      originalPrice:
        Number(formData.get("originalPrice")) || Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      weight: formData.get("weight"),
      unit: formData.get("unit"),
      slug: createSlug(formData.get("name") as string),
      isFeatured: formData.get("isFeatured") === "on",
      isBestSeller: formData.get("isBestSeller") === "on",
      isNewProduct: formData.get("isNew") === "on",
      isOrganic: formData.get("isOrganic") === "on",
      tags: tags,
    };

    const submissionData = new FormData();
    submissionData.append("data", JSON.stringify(payload));

    files.forEach((file) => {
      submissionData.append("files", file);
    });

    try {
      await createProduct(submissionData).unwrap();
      toast.success("Product added successfully!");
      router.push("/dashboard/products");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.data?.message || error.message || "Failed to add product",
        { style: { color: "#EF4444" } },
      );
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-gray-600"
        >
          <Link href="/dashboard/products">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500">Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic info */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-5">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Product Name *</Label>
                  <Input
                    name="name"
                    required
                    placeholder="e.g., Organic Fresh Tomatoes"
                    className="border-gray-200 py-5 rounded"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Description *</Label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    placeholder="Describe the product in detail..."
                    className="w-full rounded border border-gray-200  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] resize-none"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Category *</Label>
                    <Select
                      name="category"
                      required
                      value={selectedCategory}
                      onValueChange={(value) => {
                        setSelectedCategory(value);
                      }}
                    >
                      <SelectTrigger className="w-full rounded border-gray-200 py-5">
                        <SelectValue placeholder="Select category">
                          {selectedCategoryObj?.name || "Select category"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="px-4 py-3 rounded">
                        {categories.map((c: ICategory) => (
                          <SelectItem
                            key={c._id}
                            value={c._id}
                            className="my-1"
                          >
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Brand</Label>
                    <Input
                      name="brand"
                      placeholder="e.g., Farm Fresh"
                      className="border-gray-200 py-5 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl border  p-6">
              <h3 className="font-bold text-gray-900 mb-5">
                Pricing & Inventory
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Regular Price ($) *
                  </Label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="rounded border-gray-200 py-5"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Original Price ($)
                  </Label>
                  <Input
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="rounded border-gray-200 py-5"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Stock Quantity *
                  </Label>
                  <Input
                    name="stock"
                    type="number"
                    required
                    placeholder="0"
                    className="rounded border-gray-200 py-5"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Unit</Label>
                  <Select name="unit">
                    <SelectTrigger className="w-full rounded border-gray-200 py-5">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="px-4 py-3 rounded">
                      {[
                        "kg",
                        "g",
                        "lb",
                        "piece",
                        "pack",
                        "bottle",
                        "loaf",
                        "pot",
                        "jar",
                        "bag",
                        "fillet",
                      ].map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium ">Weight/Size</Label>
                  <Input
                    name="weight"
                    placeholder="e.g., 500g"
                    className="rounded border-gray-200 py-5 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border  p-6">
              <h3 className="font-bold text-gray-900 mb-4">Tags</h3>
              <div className="flex gap-2 mb-3">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="Add a tag and press Enter"
                  className="rounded border-gray-200 py-5"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="border-[#6366F1] text-[#6366F1] shrink-0 rounded py-5 px-4"
                >
                  <Plus className="size-5" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-[#EEF2FF] text-[#6366F1] text-xs px-2.5 py-1 rounded-full"
                    >
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-5 rounded-full text-red-500 hover:bg-[#E0E7FF]"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            {/* Image upload */}
            <div className="bg-white rounded-2xl border  p-5">
              <h3 className="font-bold text-gray-900 mb-4">Product Images</h3>
              <FileUpload
                maxFiles={5}
                maxSize={5 * 1024 * 1024}
                className="w-full max-w-md"
                value={files}
                onValueChange={setFiles}
                onFileReject={onFileReject}
                multiple
              >
                <FileUploadDropzone>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                      <Upload className="size-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">
                      Drag & drop files here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Or click to browse (max 5 files, up to 5MB each)
                    </p>
                  </div>
                  <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                      Browse files
                    </Button>
                  </FileUploadTrigger>
                </FileUploadDropzone>
                <FileUploadList>
                  {files.map((file, index) => (
                    <FileUploadItem key={index} value={file}>
                      <FileUploadItemPreview />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <X className="size-4" />
                        </Button>
                      </FileUploadItemDelete>
                    </FileUploadItem>
                  ))}
                </FileUploadList>
              </FileUpload>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative rounded-lg overflow-hidden aspect-square bg-[#F9FAFB]"
                    >
                      <Image
                        alt="Products Images"
                        width={500}
                        height={500}
                        src={img}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product flags */}
            <div className="bg-white rounded-2xl border  p-5">
              <h3 className="font-bold text-gray-900 mb-4">Product Options</h3>
              <div className="space-y-3">
                {[
                  { id: "isFeatured", label: "Featured Product" },
                  { id: "isBestSeller", label: "Best Seller" },
                  { id: "isNew", label: "New Arrival" },
                  { id: "isOrganic", label: "Organic Product" },
                ].map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <Checkbox
                      id={opt.id}
                      name={opt.id}
                      value="on"
                      className=" data-[state=checked]:bg-[#6366F1] data-[state=checked]:border-[#6366F1]"
                    />
                    <Label
                      htmlFor={opt.id}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5] h-11 font-semibold"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Product"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full "
                asChild
              >
                <Link href="/dashboard/products">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
