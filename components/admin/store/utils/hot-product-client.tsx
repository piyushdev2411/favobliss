"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "../utils/header";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "../utils/data-table";
import { ApiList } from "./api-list.";
import { hotProductColumns, HotProductColumn } from "./columns";

interface HotProductClientProps {
  data: HotProductColumn[];
}

export const HotProductClient = ({ data }: HotProductClientProps) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title="Hot Products Sections"
          badge={data.length.toString()}
          description="Promote trending or featured products with banners"
        />
        <Button
          onClick={() => router.push(`/admin/hot-product/create`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={hotProductColumns}
        data={data}
        searchKey="title"
      />
      <Header title="API" description="API calls for hot products sections" />
      <ApiList
        entityName="hot-products"
        entityIdName="hotProductId"
      />
    </>
  );
};