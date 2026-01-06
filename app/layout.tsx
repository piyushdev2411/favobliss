import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";
import { ModalProvider } from "@/providers/admin/modal-provider";
import { ThemeProvider } from "@/providers/admin/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/assets/favicon.ico" sizes="any" />
      <body className={roboto.className}>
        <Analytics />
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider />
            <Toaster position="bottom-right" />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
