import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Roboto } from "next/font/google";
import "../../globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ModalProvider } from "@/providers/modal-provider";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { FlowbiteProvider } from "@/providers/flowbite";
import Script from "next/script";
import "react-loading-skeleton/dist/skeleton.css";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import { getCategories } from "@/actions/get-categories";

const inter = Urbanist({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

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
      <div className="min-h-[calc(100%-4rem)] bg-gray-100 flex items-center justify-center py-10">
        {children}
      </div>
      <WhatsAppButton />
      <Footer categories={data} />
    </div>
  );
}
