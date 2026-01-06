"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Location, LocationGroup } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import Select from "react-select";

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
import { LocationGroupFormSchema } from "@/schemas/admin/location-group-form-schema";
import { Checkbox } from "@/components/ui/checkbox";

interface LocationGroupFormProps {
  data: (LocationGroup & { locations: Location[] }) | null;
  locations: { id: string; pincode: string; city: string }[];
}

export const LocationGroupForm = ({
  data,
  locations,
}: LocationGroupFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = data ? "Edit Location Group" : "Create Location Group";
  const description = data
    ? "Edit a location group"
    : "Add a new location group";
  const toastMessage = data
    ? "Location Group updated."
    : "Location Group created.";
  const actions = data ? "Save Changes" : "Create";

  const form = useForm<z.infer<typeof LocationGroupFormSchema>>({
    resolver: zodResolver(LocationGroupFormSchema),
    defaultValues: data
      ? {
          name: data.name,
          locationIds: data.locations.map((loc) => loc.id),
          isCodAvailable: data.isCodAvailable,
          deliveryDays: data.deliveryDays ?? 1,
          isExpressDelivery: data.isExpressDelivery ?? false,
          expressDeliveryText: data.expressDeliveryText ?? "",
        }
      : {
          name: "",
          locationIds: [],
          isCodAvailable: false,
          isExpressDelivery: false,
          deliveryDays: 1,
          expressDeliveryText: "",
        },
  });

  const locationOptions = locations.map((location) => ({
    value: location.id,
    label: `${location.pincode} - ${location.city}`,
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

  const onSubmit = async (values: z.infer<typeof LocationGroupFormSchema>) => {
    try {
      setLoading(true);

      if (data) {
        await axios.patch(
          `/api/admin/${process.env.NEXT_PUBLIC_STORE_ID}/location-group/${params.locationGroupId}`,
          values
        );
      } else {
        await axios.post(
          `/api/admin/${process.env.NEXT_PUBLIC_STORE_ID}/location-group`,
          values
        );
      }
      router.refresh();
      router.push(`/admin/location-group`);
      router.refresh();
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
        `/api/admin/${process.env.NEXT_PUBLIC_STORE_ID}/location-group/${params.locationGroupId}`
      );
      router.refresh();
      router.push(`/admin/location-group`);
      router.refresh();
      toast.success("Location Group deleted");
    } catch (error) {
      console.error(error);
      toast.error(
        "Make sure you removed all related locations and variant prices first."
      );
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
                      placeholder="Location Group Name"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Days</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={loading}
                      placeholder="Enter delivery days"
                      min="1"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expressDeliveryText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Express Delivery Text</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Express Delivery Text"
                    />
                  </FormControl>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isCodAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Cash on Delivery</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable Cash on Delivery for this location
                    </p>
                  </div>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isExpressDelivery"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Express Delivery</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable Express Delivery on this location
                    </p>
                  </div>
                  <FormMessage className="w-full px-2 py-2 bg-destructive/20 text-destructive/70 rounded-md" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="locationIds"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>
                  Locations ({field.value?.length || 0} selected)
                </FormLabel>
                <FormControl>
                  <Select
                    isMulti
                    options={locationOptions}
                    value={locationOptions.filter((option) =>
                      field.value?.includes(option.value)
                    )}
                    onChange={(selected) => {
                      const newSelectedIds = selected.map(
                        (option) => option.value
                      );
                      field.onChange(newSelectedIds);
                    }}
                    placeholder="Select locations..."
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
                        const location = locations.find((loc) => loc.id === id);
                        return (
                          <div
                            key={id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border rounded-md text-sm hover:bg-accent transition-colors"
                          >
                            <span className="text-foreground">
                              {location
                                ? `${location.pincode} - ${location.city}`
                                : "Unknown Location"}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(
                                  field.value?.filter((locId) => locId !== id)
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
