import Script from "next/script";

interface CheckoutLayoutPage {
  children: React.ReactNode;
}

const CheckoutLayoutPage = ({ children }: CheckoutLayoutPage) => {
  return (
    <main className="min-h-full">
      {/* <CartBreadcrumb /> */}
      {children}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </main>
  );
};

export default CheckoutLayoutPage;
