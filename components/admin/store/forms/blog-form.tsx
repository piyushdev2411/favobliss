"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Blog } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { Header } from "@/components/admin/store/utils/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/admin/modals/alert-modal";
import { SingleImageUpload } from "@/components/admin/store/utils/single-image-upload";
import { BlogFormSchema } from "@/schemas/admin/blog-form-schema";
import { ProductFeatures } from "../utils/product-features";

interface BlogFormProps {
  initialData: Blog | null;
}

export const BlogForm = ({ initialData }: BlogFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Blog" : "Create Blog";
  const description = initialData ? "Edit a blog post" : "Add a new blog post";
  const toastMessage = initialData ? "Blog updated." : "Blog created.";
  const actions = initialData ? "Save Changes" : "Create";

  const form = useForm<z.infer<typeof BlogFormSchema>>({
    resolver: zodResolver(BlogFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          banner: initialData.banner || "",
          postedBy: initialData.postedBy || "",
          published: initialData.published || false,
          metaTitle: initialData.metaTitle || "",
          metaDescription: initialData.metaDescription || "",
          metaKeywords: initialData.metaKeywords || [],
          openGraphImage: initialData.openGraphImage || "",
        }
      : {
          title: "",
          slug: "",
          banner: "",
          postedBy: "",
          published: false,
          metaTitle: "",
          metaDescription: "",
          metaKeywords: [],
          openGraphImage: "",
        },
  });

  const onSubmit = async (
    values: z.infer<typeof BlogFormSchema>,
    editContent = false
  ) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/blogs/${params.blogId}`, values);
        // router.refresh();
        if (editContent) {
          router.push(`/admin/blog/${params.blogId}/content`);
          return;
        }
        router.push(`/admin/blog`);
        toast.success(toastMessage);
      } else {
        const createValues = {
          ...values,
          published: false,
        };
        const response = await axios.post("/api/blogs", createValues);
        const newBlog = response.data;
        router.push(`/admin/blog/${newBlog.id}/content`);
        toast.success(toastMessage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/blogs/${params.blogId}`);
      router.refresh();
      router.push(`/admin/blog`);
      toast.success("Blog deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Make sure you want to delete this blog.");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const handleEditContent = (e: React.MouseEvent) => {
    e.preventDefault(); 
    onSubmit(form.getValues(), true); 
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Header title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => onSubmit(values))} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Blog title"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="blog-slug"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posted By (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Author name or ID"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Published</FormLabel>
                  </div>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Banner Image</FormLabel>
                <FormControl>
                  <SingleImageUpload
                    value={field.value || ""}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
              </FormItem>
            )}
          />
           <FormField
                    control={form.control}
                    name={"metaTitle"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="SEO meta title (max 60 characters)"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"metaDescription"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="SEO meta description (max 160 characters)"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"openGraphImage"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Open Graph Image URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="URL for Open Graph image"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"metaKeywords"}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Meta Keywords</FormLabel>
                        <ProductFeatures
                          value={field.value || []}
                          disabled={loading}
                          onChange={(value) =>
                            field.onChange([...(field.value || []), value])
                          }
                          onRemove={(value) =>
                            field.onChange(
                              (field.value || []).filter((data) => data !== value)
                            )
                          }
                        />
                        <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                      </FormItem>
                    )}
                  />
          <div className="flex flex-col md:flex-row gap-2">
            <Button type="submit" disabled={loading}>
              {actions}
            </Button>
            {initialData && (
              <Button
                type="button"
                disabled={loading}
                onClick={handleEditContent}
              >
                Edit Content
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};
