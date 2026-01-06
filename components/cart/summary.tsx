"use client";

import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useCheckout } from "@/hooks/use-checkout";
import { useCheckoutAddress } from "@/hooks/use-checkout-address";
import { usePaymentSuccessErrorModal } from "@/hooks/use-payment-success-error-modal";
import { useCart } from "@/hooks/use-cart";
import { getCoupons } from "@/actions/get-coupons";
import { Coupons, CartSelectedItem } from "@/types";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Address } from "@prisma/client";

interface Props {
  isAddressCorrect?: boolean;
}

export const Summary = (props: Props) => {
  const { isAddressCorrect = true } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const session = useSession();
  const { address } = useCheckoutAddress();
  const { items, removeAll, getTotalMrp } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">(
    "razorpay"
  );
  const [gstNumber, setGstNumber] = useState<string>("");
  const [hasGstNumber, setHasGstNumber] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const {
    checkOutItems,
    clearCheckOutItems,
    appliedCoupon,
    discount,
    applyCoupon,
    removeCoupon,
  } = useCheckout();
  const { onOpen, onClose } = usePaymentSuccessErrorModal();
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState<Coupons[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [isCODAvailable, setIsCODAvailable] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setIsCODAvailable(false);
      return;
    }

    const allItemsCodAvailable = items.every(
      (item) => item.isCodAvailable === true
    );
    setIsCODAvailable(allItemsCodAvailable);
  }, [items]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const fetchedCoupons = await getCoupons();
        setCoupons(fetchedCoupons);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        toast.error("Failed to load coupons");
      } finally {
        setLoadingCoupons(false);
      }
    };
    fetchCoupons();
  }, []);

  const getTotalAmount = () => {
    return checkOutItems.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  const handleApplyCoupon = () => {
    const coupon = coupons.find((c) => c.code === couponCode);
    if (!coupon) {
      toast.error("Invalid coupon code");
      return;
    }
    if (!coupon.isActive) {
      toast.error("Coupon is not active");
      return;
    }
    const currentDate = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    if (currentDate > expiryDate) {
      toast.error("Coupon has expired");
      return;
    }
    if (
      coupon.products &&
      coupon.products.length > 0 &&
      coupon.products[0].id
    ) {
      const cartProductIds = checkOutItems.map((item) => item?.id);
      const couponProductIds = coupon.products.map((p) => p.productId);
      const isMatch = couponProductIds.some((id) =>
        cartProductIds.includes(id)
      );
      if (!isMatch) {
        toast.error("Coupon does not apply to the products in your cart");
        return;
      }
    }
    applyCoupon(coupon);
    toast.success("Coupon applied successfully");
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.success("Coupon removed");
  };

  const onCheckOut = async () => {
    try {
      if (session.status === "unauthenticated") {
        router.push("/login");
        return;
      }

      if (pathname.includes("/checkout/cart")) {
        router.push("/checkout/address");
        return;
      }

      if (!address) {
        toast.error("Please provide a shipping address");
        return;
      }

      setLoading(true);
      const response = await axios.post(`/api/v1/order`, {
        products: checkOutItems.map((item) => ({
          id: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          mrp: item.mrp,
          size: item.size || "",
          color: item.color || "",
          image: item.image,
          name: item.name,
          slug: item.slug,
          locationId: item.locationId,
        })),
        address,
        paymentMethod,
        discount,
        coupon: appliedCoupon
          ? { code: appliedCoupon.code, value: discount }
          : null,
        gstNumber: hasGstNumber ? gstNumber : undefined,
      });

      const { orderId, razorpayData } = response.data;

      if (paymentMethod === "cod") {
        removeAll();
        clearCheckOutItems();
        onOpen("success");
      } else if (paymentMethod === "razorpay" && razorpayData) {
        const {
          orderId: razorpayOrderId,
          amount,
          currency,
          key,
        } = razorpayData;

        const addressForNotes = {
          address: address.address || "",
          landmark: address.landmark || "",
          town: address.town || "",
          district: address.district || "",
          state: address.state || "",
          zipCode: address.zipCode || "",
        };

        let addressJsonString;
        try {
          addressJsonString = JSON.stringify(addressForNotes);
          JSON.parse(addressJsonString);
        } catch (error) {
          console.error("Failed to stringify address:", error);
          throw new Error("Invalid address format");
        }

        const options = {
          key,
          amount: amount - discount * 100,
          currency,
          name: "Favobliss",
          description: "Order Payment",
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            try {
              await axios.patch(`/api/v1/order/${orderId}`, {
                action: "updatePayment",
                isPaid: true,
              });
              removeAll();
              clearCheckOutItems();
              onOpen("success");
            } catch (error) {
              console.error("Error updating order status:", error);
              toast.error(
                "Payment successful, but failed to update order status"
              );
              // Optionally navigate here if needed, but let modal handle success
            }
          },
          prefill: {
            name: address.name || "",
            email: session.data?.user?.email || "",
            contact: address.phoneNumber || "",
          },
          notes: {
            orderId: orderId,
            address: addressJsonString,
          },
          theme: {
            color: "#3399cc",
          },
        };

        //@ts-ignore
        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", function (response: any) {
          router.push(`/checkout/cart?cancelled=true`);
        });
        razorpay.open();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f4f4] px-6 py-6 rounded-3xl">
      <h2 className="text-2xl font-normal text-gray-900 mb-6">Order Summary</h2>

      {/* Coupon Code Section */}
      {!appliedCoupon ? (
        <div className="mb-4">
          <div className="flex border rounded-full overflow-hidden bg-white">
            <Input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none border-0 focus-visible:ring-white"
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={loadingCoupons || !couponCode}
              className="px-6 py-3 text-black text-sm font-medium border-0 bg-transparent hover:bg-orange-400"
            >
              Apply
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">
                Coupon Applied: {appliedCoupon.code}
              </p>
              <p className="text-xs text-green-600">
                You saved {formatter.format(discount)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-green-600 hover:text-green-800 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 text-sm">MRP</span>
          <span className="text-gray-900 font-medium">
            {formatter.format(getTotalMrp()).replace("₹", "")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 text-sm">Discount on MRP</span>
          <span className="text-green-600 font-medium">
            -
            {formatter
              .format(getTotalMrp() - getTotalAmount())
              .replace("₹", "")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 text-sm">Shipping Charge</span>
          <span className="text-gray-900 font-medium">00.00</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700 text-sm">Coupon Discount</span>
            <span className="text-green-600 font-medium">
              -{formatter.format(discount).replace("₹", "")}
            </span>
          </div>
        )}
      </div>

      {/* Sub Total */}
      <div className="flex justify-between items-center pb-4 mb-6">
        <span className="text-lg font-semibold text-gray-900">Sub Total:</span>
        <span className="text-lg font-semibold text-gray-900">
          {formatter.format(getTotalAmount() - discount).replace("₹", "")}
        </span>
      </div>

      {/* GST Number Section */}
      {pathname !== "/checkout/cart" && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Checkbox
              id="gst-checkbox"
              checked={hasGstNumber}
              onCheckedChange={(checked) => setHasGstNumber(checked === true)}
            />
            <Label htmlFor="gst-checkbox" className="text-sm text-gray-700">
              I have a GST Number
            </Label>
          </div>

          {hasGstNumber && (
            <Input
              placeholder="GST"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="w-full bg-white border-gray-300"
            />
          )}
        </div>
      )}
      {pathname !== "/checkout/cart" && (
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-gray-700">
            Payment Method
          </Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value: "razorpay" | "cod") =>
              setPaymentMethod(value)
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="razorpay" id="razorpay" />
              <Label htmlFor="razorpay" className="text-sm">
                Pay Online
              </Label>
            </div>
            {isCODAvailable && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="text-sm">
                  Cash on Delivery
                </Label>
              </div>
            )}
          </RadioGroup>
        </div>
      )}

      {/* Checkout Button */}
      <Button
        size="lg"
        disabled={loading || !isAddressCorrect}
        className="w-full bg-orange-400 hover:bg-orange-500 text-gray-900 font-semibold py-4 rounded-full text-base"
        onClick={onCheckOut}
      >
        {pathname === "/checkout/cart" ? "Proceed to Checkout" : "PLACE ORDER"}
      </Button>
    </div>
  );
};