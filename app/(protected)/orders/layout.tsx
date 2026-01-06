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

export const metadata: Metadata = {
  title: "Orders",
};

interface OrdersLayoutPageProps {
  children: React.ReactNode;
}

const OrdersLayoutPage = async ({ children }: OrdersLayoutPageProps) => {
  const data = await getCategories();
  return (
    <div>
      <ModalProvider />
      <FlowbiteProvider />
      <Toaster position="bottom-right" />
      <Navbar />
      <div className="w-full min-h-full">{children}</div>
      <WhatsAppButton />
      <Footer categories={data} />
    </div>
  );
};

export default OrdersLayoutPage;
