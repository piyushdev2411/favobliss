import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ModalProvider } from "@/providers/modal-provider";
import { Toaster } from "sonner";
import { FlowbiteProvider } from "@/providers/flowbite";
import "react-loading-skeleton/dist/skeleton.css";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import { getCategories } from "@/actions/get-categories";
import "swiper/css";
import "swiper/css/free-mode";
import "../globals.css";

export const metadata: Metadata = {
  title: "Favobliss – Your One-Stop Shop for the Latest Electronics",
  keywords: [
    "Electronics online, buy electronics, smartphones, home appliances, gadgets, top brands, best deals, fast delivery, online shopping, Favobliss",
  ],
  description:
    "Favobliss Explore a wide range of smartphones, home appliances, and more from top brands at unbeatable prices. Fast delivery &amp; great deals.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getCategories();
  return (
    <div>
      <ModalProvider />
      <FlowbiteProvider />
      <Toaster position="bottom-right" />
      <Navbar />
      {children}
      <WhatsAppButton />
      <Footer categories={data} />
    </div>
  );
}
