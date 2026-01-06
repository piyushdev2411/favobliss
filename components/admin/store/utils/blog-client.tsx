"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/admin/store/utils/header";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BlogColumn, blogColumns } from "./columns";
import { DataTable } from "@/components/admin/store/utils/data-table";

interface BlogClientProps {
  data: BlogColumn[];
}

export const BlogClient = ({ data }: BlogClientProps) => {
  const router = useRouter();

  const ss = ()=>{
    console.log("clicked");
    router.push(`/admin/blog/create`)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title="Blog Posts"
          badge={data.length.toString()}
          description="Manage your blog posts"
        />
        <Button onClick={ss}>
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>
      <Separator />
      <DataTable columns={blogColumns} data={data} searchKey="title" />
    </>
  );
};
