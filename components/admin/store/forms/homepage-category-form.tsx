"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { HomepageCategory, Product } from "@prisma/client";
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
import { Trash2, X } from "lucide-react";
import { Header } from "@/components/admin/store/utils/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/admin/modals/alert-modal";
import { HomepageCategoryFormSchema } from "@/schemas/admin/homepage-category-form-schema";
import Select from "react-select";

interface HomepageCategoryFormProps {
  data: (HomepageCategory & { products: { product: Product }[] }) | null;
  products: (Product & { variants: { images: { url: string }[] }[] })[];
}

export const HomepageCategoryForm = ({
  data,
  products,
}: HomepageCategoryFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    data ? data.products.map((p) => p.product.id) : []
  );
  const params = useParams();
  const router = useRouter();

  const title = data ? "Edit Homepage Category" : "Create Homepage Category";
  const description = data
    ? "Edit a homepage category"
    : "Add a new homepage category";
  const toastMessage = data
    ? "Homepage category updated."
    : "Homepage category created.";
  const actions = data ? "Save Changes" : "Create";

  const form = useForm<z.infer<typeof HomepageCategoryFormSchema>>({
    resolver: zodResolver(HomepageCategoryFormSchema),
    defaultValues: data
      ? {
          name: data.name,
          description: data.description || "",
        }
      : {
          name: "",
          description: "",
        },
  });

  const productOptions = products.map((product) => ({
    value: product.id,
    //@ts-ignore
    label: product.variants[0]?.name || "Unnamed Product",
  }));

  const selectedOptions = selectedProductIds.map((id) => ({
    value: id,
    label:
    //@ts-ignore
      products.find((p) => p.id === id)?.variants[0]?.name || "Unnamed Product",
  }));

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "0.375rem",
      borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
      backgroundColor: "hsl(var(--background))",
      boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--ring))" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
      },
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: "2px 12px",
    }),
    input: (base: any) => ({
      ...base,
      margin: 0,
      padding: 0,
      color: "hsl(var(--foreground))",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "hsl(var(--muted-foreground))",
      fontSize: "0.875rem",
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "0.375rem",
      backgroundColor: "hsl(var(--popover))",
      border: "1px solid hsl(var(--border))",
      boxShadow:
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      zIndex: 50,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: "4px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      borderRadius: "0.25rem",
      backgroundColor: state.isSelected
        ? "lightgray"
        : state.isFocused
        ? "hsl(var(--accent))"
        : "transparent",
      color: state.isSelected
        ? "hsl(var(--accent-foreground))"
        : "hsl(var(--popover-foreground))",
      fontSize: "0.875rem",
      padding: "8px 12px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "hsl(var(--accent))",
      },
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "hsl(var(--secondary))",
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "hsl(var(--secondary-foreground))",
      fontSize: "0.875rem",
      padding: "2px 6px",
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "hsl(var(--secondary-foreground))",
      borderRadius: "0 0.25rem 0.25rem 0",
      "&:hover": {
        backgroundColor: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
      },
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      backgroundColor: "hsl(var(--border))",
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: "hsl(var(--muted-foreground))",
      "&:hover": {
        color: "hsl(var(--foreground))",
      },
    }),
    clearIndicator: (base: any) => ({
      ...base,
      color: "hsl(var(--muted-foreground))",
      "&:hover": {
        color: "hsl(var(--foreground))",
      },
    }),
  };

  const onSubmit = async (
    values: z.infer<typeof HomepageCategoryFormSchema>
  ) => {
    try {
      setLoading(true);

      let categoryId = data ? params.homepageCategoryId : null;

      if (data) {
        await axios.patch(
          `/api/admin/${process.env.NEXT_PUBLIC_STORE_ID}/homepage-categories/${params.homepageCategoryId}`,
          values
        );
      } else {
        const response = await axios.post(
          `/api/admin/${process.env.NEXT_PUBLIC_STORE_ID}/homepage-categories`,
          values
        );
        categoryId = response.data.id;
      }

      if (selectedProductIds.length > 0 && categoryId) {
        await axios.post(
          `/api/admin/${process.env.NEXT_PUBLIC_STORE_ID}/homepage-categories/${categoryId}/products`,
          { productIds: selectedProductIds }
        );
      }

      router.refresh();
      router.push(`/admin/homepage-categories`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      console.log("[HomepageCategoryForm] Submit error:", error);
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/admin/${params.storeId}/homepage-categories/${params.homepageCategoryId}`
      );
      router.refresh();
      router.push(`/admin/${params.storeId}/homepage-categories`);
      router.refresh();
      toast.success("Homepage category deleted");
    } catch (error) {
      console.error("[HomepageCategoryForm] Delete error:", error);
      toast.error("Make sure you removed all related data first.");
    } finally {
      setLoading(false);
    }
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
        {data && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash2 />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Category name"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Description (optional)"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
          </div>

          <FormItem className="col-span-full">
            <FormLabel>
              Products ({selectedProductIds.length} selected)
            </FormLabel>
            <FormControl>
              <Select
                isMulti
                options={productOptions}
                value={selectedOptions}
                onChange={(selected) => {
                  const newSelectedIds = selected.map((option) => option.value);
                  setSelectedProductIds(newSelectedIds);
                }}
                placeholder="Select products..."
                isDisabled={loading}
                styles={customStyles}
                className="react-select-container"
                classNamePrefix="react-select"
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                controlShouldRenderValue={false}
              />
            </FormControl>

            {selectedProductIds.length > 0 && (
              <div className="mt-3 p-3 border rounded-md bg-muted/30 max-h-[300px] overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {selectedProductIds.map((id) => {
                    const product = products.find((p) => p.id === id);
                    return (
                      <div
                        key={id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border rounded-md text-sm hover:bg-accent transition-colors"
                      >
                        <span className="text-foreground">
                            
                          {//@ts-ignore
                          product?.variants[0]?.name || "Unnamed Product"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProductIds(
                              selectedProductIds.filter((pid) => pid !== id)
                            );
                          }}
                          disabled={loading}
                          className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
          </FormItem>

          <Button type="submit" disabled={loading}>
            {actions}
          </Button>
        </form>
      </Form>
    </>
  );
};
