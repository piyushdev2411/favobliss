"use client";

import { Product, LocationGroup, Variant } from "@/types"; // Assuming Variant is imported or defined as type Variant = Product['variants'][number];
import Image from "next/image";
import { formatter } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useState, useEffect } from "react";
import { usePreviewModal } from "@/hooks/use-preview-modal";
import { useCart } from "@/hooks/use-cart";
import { Star } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  data: Product;
  variant?: Variant;
  locationGroups: LocationGroup[];
}

export const ProductCard = ({
  data,
  variant,
  locationGroups,
}: ProductCardProps) => {
  const router = useRouter();
  const { onOpen } = usePreviewModal();
  const { addItem } = useCart();
  const theVariant = variant || data.variants[0];
  const [locationPrice, setLocationPrice] = useState<{
    price: number;
    mrp: number;
  }>({
    price: theVariant?.variantPrices.find((vp) => vp.price > 0)?.price || 0,
    mrp:
      theVariant?.variantPrices.find((vp) => vp.price > 0)?.mrp ||
      theVariant?.variantPrices.find((vp) => vp.price > 0)?.price ||
      0,
  });
  const [selectedLocationGroupId, setSelectedLocationGroupId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const defaultLocationGroupId = "68acbf8a6fd4d122ffa12404";
    let locationData: { pincode: string } | null = null;
    try {
      const storedData = localStorage.getItem("locationData");
      if (storedData) {
        locationData = JSON.parse(storedData);
      }
    } catch (error) {
      console.error("Error parsing locationData from localStorage:", error);
    }

    const inputPincode = locationData?.pincode;
    const locationGroup = inputPincode
      ? locationGroups?.find((lg) =>
          lg.locations.some((loc) => loc.pincode === inputPincode)
        )
      : null;

    if (locationGroup && theVariant?.variantPrices) {
      const variantPrice = theVariant.variantPrices.find(
        (vp) => vp.locationGroupId === locationGroup.id
      );
      if (variantPrice && variantPrice.price > 0) {
        setSelectedLocationGroupId(locationGroup.id);
        setLocationPrice({
          price: variantPrice.price,
          mrp: variantPrice.mrp || variantPrice.price,
        });
        return;
      }
    }

    // Fallback to default location group or variant price
    const defaultLocationGroup = locationGroups?.find(
      (lg) => lg.id === defaultLocationGroupId
    );
    const defaultVariantPrice = defaultLocationGroup
      ? theVariant?.variantPrices?.find(
          (vp) => vp.locationGroupId === defaultLocationGroup.id
        )
      : null;

    if (defaultVariantPrice && defaultVariantPrice.price > 0) {
      setSelectedLocationGroupId(defaultLocationGroup?.id || null);
      setLocationPrice({
        price: defaultVariantPrice.price,
        mrp: defaultVariantPrice.mrp || defaultVariantPrice.price,
      });
    } else {
      // If even default is 0 or not found, fall back to any available price > 0
      const anyVariantPrice = theVariant.variantPrices.find(
        (vp) => vp.price > 0
      );
      setSelectedLocationGroupId(
        anyVariantPrice ? anyVariantPrice.locationGroupId : null
      );
      setLocationPrice({
        price: anyVariantPrice?.price || 0,
        mrp: anyVariantPrice?.mrp || anyVariantPrice?.price || 0,
      });
    }
  }, [data, variant, locationGroups, theVariant]);

  const onClick = () => {
    router.push(`/${theVariant?.slug}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    onOpen(data);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = (price: number, mrp: number) => {
    if (!mrp || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 md:w-4 md:h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };
  if (
    theVariant.name ==
    "Xiaomi Smart Air Purifier 4 Lite | True HEPA Filter Removes 99.97% Particles | Smart App & Voice Control (Alexa & Google) | 360° Filtration | High CADR for Large Rooms | Low Noise & Energy Efficient | 1-Year Warranty"
  ) {
  }

  const sortedImages = theVariant?.images?.sort((a, b) => a.id.localeCompare(b.id)) || [];

  const imageUrl = sortedImages[0]?.url || "/placeholder-image.jpg";
  const discount = calculateDiscount(locationPrice.price, locationPrice.mrp);

  return (
    <Link href={`/${theVariant?.slug}`} className="w-full cursor-pointer">
      <div className="relative bg-gray-100 rounded-xl p-3 md:p-4 shadow-[0_0_15px_0_rgba(107,114,128,0.25)] hover:shadow-[0_0_20px_0_rgba(107,114,128,0.35)] transition-shadow duration-200 h-full">
        {/* <div className="absolute top-2 left-2 bg-orange-400 text-white text-xs px-2 py-1 rounded-full font-medium z-[10]">
          {discount}% off
        </div> */}

        <div className="aspect-square mb-3 md:mb-4 flex items-center justify-center bg-white rounded-lg relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={theVariant.name}
            fill
            className="object-contain rounded-lg p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {theVariant && theVariant.stock === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 text-xs md:text-sm leading-tight line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
            {theVariant.name}
          </h3>
          <div className="flex items-center space-x-1">
            {renderStars(data.averageRating || 0)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-col flex-wrap sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
              <span
                className="text-[16px] font-bold text-gray-900"
                style={{ fontSize: "16px" }}
              >
                {formatPrice(locationPrice.price)}
              </span>
              <div className="flex items-center space-x-2 flex-wrap">
                {locationPrice.mrp > locationPrice.price && (
                  <div
                    className="text-[12px] text-gray-500 whitespace-nowrap"
                    style={{ fontSize: "12px" }}
                  >
                    MRP{" "}
                    <span className="line-through">
                      {formatPrice(locationPrice.mrp)}
                    </span>
                  </div>
                )}
                <div
                  className="bg-orange-400 text-white text-[12px] px-2 py-1 rounded-full font-medium whitespace-nowrap"
                  style={{ fontSize: "12px" }}
                >
                  {discount}% off
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
