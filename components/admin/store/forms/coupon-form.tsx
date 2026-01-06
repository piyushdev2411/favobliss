"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Coupon, Product } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import Select from "react-select";
import {
  Form,
  FormControl,
  FormDescription,
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
import { CouponFormSchema } from "@/schemas/admin/coupon-form-schema";
import { Switch } from "@/components/ui/switch";

interface CouponFormProps {
  data: (Coupon & { products: { product: Product }[] }) | null;
  products: { id: string; name: string }[];
}

export const CouponForm = ({ data, products }: CouponFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = data ? "Edit Coupon" : "Create Coupon";
  const description = data ? "Edit a coupon" : "Add a new coupon";
  const toastMessage = data ? "Coupon updated." : "Coupon created.";
  const actions = data ? "Save Changes" : "Create";

  const form = useForm<z.infer<typeof CouponFormSchema>>({
    resolver: zodResolver(CouponFormSchema),
    defaultValues: data
      ? {
          code: data.code,
          isActive: data.isActive,
          value: data.value,
          startDate: data.startDate.toISOString().split("T")[0],
          expiryDate: data.expiryDate.toISOString().split("T")[0],
          productIds: data.products.map((cp) => cp.product.id),
          usagePerUser: data.usagePerUser,
          usedCount: data.usedCount || 1,
          description: data.description || "",
        }
      : {
          code: "",
          isActive: true,
          value: 0,
          startDate: "",
          expiryDate: "",
          productIds: [],
          usagePerUser: 1,
          usedCount: 1,
          description: "",
        },
  });

  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
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
      maxHeight: "300px",
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

  const onSubmit = async (values: z.infer<typeof CouponFormSchema>) => {
    try {
      setLoading(true);
      if (data) {
        await axios.patch(
          `/api/admin/${process.env.NEXT_PUBLIC_STORE_ID}/coupons/${params.couponId}`,
          values
        );
      } else {
        await axios.post(
          `/api/admin/${process.env.NEXT_PUBLIC_STORE_ID}/coupons`,
          values
        );
      }
      router.refresh();
      router.push(`/admin/coupons`);
      toast.success(toastMessage);
    } catch (error) {
      console.log(error);
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/admin/${process.env.NEXT_PUBLIC_STORE_ID}/coupons/${params.couponId}`
      );
      router.refresh();
      router.push(`/admin/coupons`);
      toast.success("Coupon deleted");
    } catch (error) {
      console.error(error);
      toast.error("Make sure no orders are using this coupon.");
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Coupon code (e.g., SAVE10)"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      disabled={loading}
                      placeholder="e.g., 10 for 10% or $10"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      disabled={loading}
                      placeholder="Start date"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      disabled={loading}
                      placeholder="Expiry date"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usagePerUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Per User</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={loading}
                      placeholder="e.g., 1"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usedCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={loading}
                      placeholder="e.g., 1"
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
                      placeholder="Coupon description"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Toggle to activate or deactivate the coupon.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="productIds"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>
                  Applicable Products ({field.value?.length || 0} selected)
                </FormLabel>
                <FormControl>
                  <Select
                    isMulti
                    options={productOptions}
                    value={productOptions.filter((option) =>
                      field.value?.includes(option.value)
                    )}
                    onChange={(selected) => {
                      const newSelectedIds = selected.map(
                        (option) => option.value
                      );
                      field.onChange(newSelectedIds);
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

                {field.value && field.value.length > 0 && (
                  <div className="mt-3 p-3 border rounded-md bg-muted/30 max-h-[300px] overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((id) => {
                        const product = products.find((p) => p.id === id);
                        return (
                          <div
                            key={id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border rounded-md text-sm hover:bg-accent transition-colors"
                          >
                            <span className="text-foreground">
                              {product?.name || "Unknown Product"}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(
                                  field.value?.filter((pid) => pid !== id)
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
            )}
          />

          <Button type="submit" disabled={loading}>
            {actions}
          </Button>
        </form>
      </Form>
    </>
  );
};
