import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/admin/navbar";
import { ModalProvider } from "@/providers/admin/modal-provider";
import { ThemeProvider } from "@/providers/admin/theme-provider";
import "../globals.css";
import { Metadata } from "next";

interface DashboardLayoutPageProps {
  children: React.ReactNode;
  params: { storeId: string };
}

export const metadata: Metadata = {
  title: "Store | Admin",
  description:
    "Effortlessly control your ecommerce empire with our intuitive admin panel. Seamlessly manage products, orders, and track revenue for optimal SEO and business success.",
};

const DashboardLayoutPage = async ({
  children,
  params,
}: DashboardLayoutPageProps) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (
    !session ||
    !userId ||
    (session.user?.email !== "piyushthakur241199@gmail.com" &&
      session.user?.email !== "favoblis@gmail.com")
  ) {
    redirect("/");
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <ModalProvider />
        <Navbar />
        <div className="md:pl-64 pt-16 md:pt-0">
          <main className="p-6 pt-0">{children}</main>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default DashboardLayoutPage;
