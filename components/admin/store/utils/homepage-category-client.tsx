"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "./header";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { HomepageCategoryColumn, homepageCategoryColumns } from "./columns";
import { DataTable } from "./data-table";
import { ApiList } from "./api-list.";

interface HomepageCategoryClientProps {
  data: HomepageCategoryColumn[];
}

export const HomepageCategoryClient = ({
  data,
}: HomepageCategoryClientProps) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title="Homepage Categories"
          badge={data.length.toString()}
          description="Homepage categories for your store"
        />
        <Button
          onClick={() =>
            router.push(`/admin/homepage-categories/create`)
          }
        >
          <Plus className="h-4 w-4 mr-2" size="sm" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={homepageCategoryColumns}
        data={data}
        searchKey="name"
      />
      <Header title="API" description="API calls for homepage categories" />
      <ApiList
        entityName="homepage-categories"
        entityIdName="homepageCategoryId"
      />
    </>
  );
};
