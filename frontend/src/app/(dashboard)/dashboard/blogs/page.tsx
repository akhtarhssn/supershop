"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MoreHorizontal, FileText } from "lucide-react";
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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.blogs.getAll();
      setBlogs(res.data?.result || res.data || []);
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      // transform tags string to array
      const formattedData = {
        ...data,
        tags:
          typeof data.tags === "string"
            ? data.tags
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean)
            : data.tags,
      };

      if (editingBlog) {
        await api.blogs.update(editingBlog._id, formattedData);
        toast.success("Blog updated successfully");
      } else {
        await api.blogs.create(formattedData);
        toast.success("Blog created successfully");
      }
      setIsDialogOpen(false);
      reset();
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to save blog");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.blogs.delete(id);
      toast.success("Blog deleted");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setValue("title", blog.title);
    setValue("author", blog.author);
    setValue("image", blog.image);
    setValue("content", blog.content);
    setValue("tags", blog.tags?.join(", "));
    setValue("status", blog.status);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500">
            Manage your store's blog content
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              reset();
              setEditingBlog(null);
            }
          }}
        >
          <DialogTrigger
            render={
              <Button className="bg-[#6366F1] hover:bg-[#4F46E5] gap-2" />
            }
          >
            <Plus className="w-4 h-4" />
            Add Post
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? "Edit Post" : "Add Post"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Title</Label>
                  <Input
                    {...register("title", { required: true })}
                    placeholder="Post title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input
                    {...register("author", { required: true })}
                    placeholder="Author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    {...register("status")}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Cover Image URL</Label>
                  <Input
                    {...register("image", { required: true })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Tags (Comma separated)</Label>
                  <Input
                    {...register("tags")}
                    placeholder="e.g. Fashion, Trends, 2024"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Content</Label>
                  <textarea
                    {...register("content", { required: true })}
                    className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none min-h-[200px]"
                    placeholder="Write your post content here..."
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5]"
              >
                Save Post
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
                  Post
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
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
                  <td colSpan={5} className="py-12 text-center">
                    <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No blog posts found</p>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded border border-gray-100 overflow-hidden bg-gray-50 shrink-0">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            width={500}
                            height={400}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1 max-w-[250px]">
                            {blog.title}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {blog.tags?.slice(0, 2).map((tag: string) => (
                              <span
                                key={tag}
                                className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {blog.tags?.length > 2 && (
                              <span className="text-[10px] text-gray-400">
                                +{blog.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">{blog.author}</td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={
                          blog.status === "Published"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-orange-50 text-orange-700 border-orange-200"
                        }
                      >
                        {blog.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(blog)}>
                            <Edit className="w-3.5 h-3.5 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(blog._id)}
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
