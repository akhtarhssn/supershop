"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Grid3X3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { categories } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const emojis = ["🥦", "🍎", "🥛", "🥩", "🍞", "🧃", "🍿", "🌿"];

export default function CategoriesPage() {
  const [items, setItems] = useState(categories);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", color: "#6366F1" });

  const filtered = items.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
    toast.success("Category deleted.");
  };

  const handleAdd = () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    const cat = {
      id: String(Date.now()),
      name: newCategory.name,
      slug: newCategory.name.toLowerCase().replace(/ /g, "-"),
      image: "",
      productCount: 0,
      color: newCategory.color,
    };
    setItems([...items, cat]);
    setNewCategory({ name: "", color: "#6366F1" });
    setDialogOpen(false);
    toast.success("Category added!");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">{items.length} categories</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#6366F1] hover:bg-[#4F46E5] gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-9 text-sm border-[#D1D5DB]"
        />
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((cat, i) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-[#D1D5DB] p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: cat.color + "20" }}
              >
                {emojis[i % emojis.length]}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="w-3.5 h-3.5 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => setDeleteId(cat.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{cat.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {cat.productCount} products
              </span>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Category Name</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Frozen Foods"
                className="border-[#D1D5DB]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[#D1D5DB]"
                />
                <span className="text-sm text-gray-500 font-mono">{newCategory.color}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[#D1D5DB]">
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-[#6366F1] hover:bg-[#4F46E5]">
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Category?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 py-2">
            This will permanently delete the category. Products in this category will become uncategorized.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-[#D1D5DB]">
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
