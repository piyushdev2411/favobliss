"use client";

import { Header } from "@/components/admin/store/utils/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/admin/store/utils/data-table";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Usercolumns, UserColumns } from "./columns";

interface UserClientProps {
  data: UserColumns[];
}

export const UserClient = ({ data }: UserClientProps) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title="Users"
          badge={data.length.toString()}
          description="Manage all registered users"
        />
      </div>

      <Separator />
      <DataTable columns={Usercolumns} data={data} searchKey="email" />
    </>
  );
};