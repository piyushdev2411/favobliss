import { format } from "date-fns";
import { db } from "@/lib/db";
import { UserColumns } from "@/components/admin/store/utils/columns";
import { UserClient } from "@/components/admin/store/utils/user-client";

export const metadata = {
  title: "Admin | Users",
};

const UsersPage = async () => {
  const rawUsers = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      mobileNumber: true,
      dob: true,
      createdAt: true,
      orders: {
        where: { isPaid: true },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const users: UserColumns[] = rawUsers.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name ?? "—",
    mobileNumber: user.mobileNumber ?? "—",
    dob: user.dob ? format(user.dob, "dd/MM/yyyy") : "—",
    totalOrders: user.orders.length,
    createdAt: format(user.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserClient data={users} />
      </div>
    </div>
  );
};

export default UsersPage;