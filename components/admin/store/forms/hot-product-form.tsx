"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/admin/store/utils/header";
import Select from "react-select";
import { SingleImageUpload } from "../utils/single-image-upload";

const formSchema = z.object({
  bannerImage: z.string().min(1, "Banner is required"),
});

export const HotProductForm = ({ initialData, allProducts }: any) => {
  const [loading, setLoading] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    initialData?.products?.map((p: any) => p.product.id) || []
  );

  const params = useParams();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { bannerImage: initialData?.bannerImage || "" },
  });

  const productOptions = allProducts.map((p: any) => ({
    value: p.id,
    label: p.variants[0]?.name || "Unnamed Product",
  }));

  const selectedOptions = selectedProductIds.map((id) => ({
    value: id,
    label:
      allProducts.find((p: any) => p.id === id)?.variants[0]?.name || "Unnamed",
  }));

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await axios.patch(`/api/admin/${process.env.NEXT_PUBLIC_STORE_ID}/hot-products`, {
        bannerImage: data.bannerImage,
        productIds: selectedProductIds,
      });
      toast.success("Hot products updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header
        title="Hot Products Banner"
        description="Manage the single hot products section on homepage"
      />
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="bannerImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Image</FormLabel>
                <FormControl>
                  <SingleImageUpload
                    value={field.value || ""}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Products ({selectedProductIds.length})</FormLabel>
            <Select
              isMulti
              options={productOptions}
              value={selectedOptions}
              onChange={(opts: any) =>
                setSelectedProductIds(opts.map((o: any) => o.value))
              }
              placeholder="Select products to feature..."
              isDisabled={loading}
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedProductIds.map((id) => {
                const prod = allProducts.find((p: any) => p.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm"
                  >
                    <span>{prod?.variants[0]?.name || "Unnamed"}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedProductIds((prev) =>
                          prev.filter((pid) => pid !== id)
                        )
                      }
                      className="text-destructive"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </FormItem>

          <Button type="submit" disabled={loading}>
            Save Changes
          </Button>
        </form>
      </Form>
    </>
  );
};
