"use client";

import { ArrowLeft, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";


import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api-client";
import { useUpdateProductMutation } from "@/redux/api/productApi";
import { Product } from "@/types/types";



export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updateProduct] = useUpdateProductMutation();
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.categories.getAll();
        setCategories(res.data || res);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await api.products.getSingle(id);
        if (res.data) {
          setProduct(res.data);
          setExistingImages(res.data.images || []);
          setTags(res.data.tags || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return notFound();
  console.log(product)

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category") || product.category?._id,
      brand: formData.get("brand"),
      price: Number(formData.get("price")),
      originalPrice: Number(formData.get("originalPrice")),
      stock: Number(formData.get("stock")),
      weight: formData.get("weight"),
      unit: formData.get("unit"),
      isFeatured: formData.get("isFeatured") === "on",
      isBestSeller: formData.get("isBestSeller") === "on",
      isNewProduct: formData.get("isNew") === "on",
      isOrganic: formData.get("isOrganic") === "on",
      images: existingImages,
      tags: tags,
    };

    const submissionData = new FormData();
    submissionData.append("data", JSON.stringify(payload));

    files.forEach((file) => {
      submissionData.append("files", file);
    });

    try {
      await updateProduct({ id, data: submissionData }).unwrap();
      toast.success("Product updated successfully!");
      router.push("/dashboard/products");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, {
        style: {
          color: "#EF4444",
        },
      });
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const removeExistingImage = (imgToRemove: string) => {
    setExistingImages(existingImages.filter((img) => img !== imgToRemove));
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-gray-600">
          <Link href="/dashboard/products">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500">#{product._id} · {product.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-6">
            <h3 className="font-bold text-gray-900 mb-5">Basic Information</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Product Name</Label>
                <Input name="name" defaultValue={product.name} className="border-[#D1D5DB]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Description</Label>
                <textarea
                  name="description"
                  defaultValue={product.description}
                  rows={4}
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] resize-none"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select name="category" defaultValue={typeof product?.category === 'object' ? product?.category?._id : product?.category}>
                    <SelectTrigger className="border-[#D1D5DB]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Brand</Label>
                  <Input name="brand" defaultValue={product.brand} className="border-[#D1D5DB]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-6">
            <h3 className="font-bold text-gray-900 mb-5">Pricing & Inventory</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Price ($)</Label>
                <Input name="price" type="number" step="0.01" defaultValue={product.price} className="border-[#D1D5DB]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Original Price ($)</Label>
                <Input name="originalPrice" type="number" step="0.01" defaultValue={product.originalPrice} className="border-[#D1D5DB]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Stock</Label>
                <Input name="stock" type="number" defaultValue={product.stock} className="border-[#D1D5DB]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Weight</Label>
                <Input name="weight" defaultValue={product.weight} className="border-[#D1D5DB]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Unit</Label>
                <Input name="unit" defaultValue={product.unit} className="border-[#D1D5DB]" />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-6">
            <h3 className="font-bold text-gray-900 mb-4">Tags</h3>
            <div className="flex gap-2 mb-3">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag and press Enter"
                className="border-[#D1D5DB]"
              />
              <Button type="button" onClick={addTag} variant="outline" className="border-[#6366F1] text-[#6366F1] shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 bg-[#EEF2FF] text-[#6366F1] text-xs px-2.5 py-1 rounded-full">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-5">
            <h3 className="font-bold text-gray-900 mb-4">Product Image</h3>
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
                  <p className="text-sm font-medium">Drag & drop files here</p>
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
            <div className="mt-6 flex flex-wrap gap-2 rounded-xl overflow-hidden bg-[#F9FAFB]">
              {existingImages.map((img, i) => (
                <div key={i} className="relative size-24">
                  <Image width={800} height={800} src={img} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img)}
                    className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center bg-red-500 rounded-full text-white cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-5">
            <h3 className="font-bold text-gray-900 mb-4">Product Options</h3>
            <div className="space-y-3">
              {[
                { id: "isFeatured", label: "Featured Product", checked: product.isFeatured },
                { id: "isBestSeller", label: "Best Seller", checked: product.isBestSeller },
                { id: "isNew", label: "New Arrival", checked: product.isNewProduct },
                { id: "isOrganic", label: "Organic Product", checked: product.isOrganic },
              ].map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <Checkbox
                    id={opt.id}
                    name={opt.id}
                    value="on"
                    defaultChecked={opt.checked}
                    className="border-[#D1D5DB] data-[state=checked]:bg-[#6366F1] data-[state=checked]:border-[#6366F1]"
                  />
                  <Label htmlFor={opt.id} className="text-sm text-gray-600 cursor-pointer">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] h-11 font-semibold"
            >
              {saving ? "Saving..." : "Update Product"}
            </Button>
            <Button asChild variant="outline" className="w-full border-[#D1D5DB]">
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
