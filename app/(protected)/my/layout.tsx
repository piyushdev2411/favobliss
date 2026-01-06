import { Sidebar } from "@/components/account/sidebar";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ModalProvider } from "@/providers/modal-provider";
import { Toaster } from "sonner";
import { FlowbiteProvider } from "@/providers/flowbite";
import Script from "next/script";
import "react-loading-skeleton/dist/skeleton.css";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import { getCategories } from "@/actions/get-categories";
import "../../globals.css";
interface AccountLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "My Account",
};

const AccountLayout = async({ children }: AccountLayoutProps) => {
    const data = await getCategories();
  return (
    <>
      <ModalProvider />
      <FlowbiteProvider />
      <Toaster position="bottom-right" />
      <Navbar />
      <div className="flex w-full justify-center min-h-full">
        <div className="w-full max-w-4xl p-4 mt-10">
          <h2 className="font-bold text-zinc-800 text-lg">Account</h2>
          <Separator />
          <div className="grid md:grid-cols-5">
            <aside className="hidden md:block border-r py-8">
              <Sidebar />
            </aside>
            <div className="w-full md:col-span-4 py-4 md:p-8">{children}</div>
          </div>
        </div>
      </div>
      <WhatsAppButton />
      <Footer categories={data} />
    </>
  );
};

export default AccountLayout;
