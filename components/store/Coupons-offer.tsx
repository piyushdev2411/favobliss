"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Coupon } from "@/types";

interface CouponSliderProps {
  coupons: Coupon[];
}

export default function CouponsOffer({ coupons }: CouponSliderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDiscount = (value: number): string => {
    const rupees = value / 100;
    return rupees % 1 === 0 ? rupees.toString() : rupees.toFixed(2);
  };

  return (
    <div className="w-full bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white border-2 border-orange-500 rounded-lg hover:bg-white transition-colors"
        style={{ borderColor: "var(--brand-orange)" }}
      >
        <span
          className="font-semibold text-base"
          style={{ color: "var(--brand-orange)" }}
        >
          🎉 Offers Available
        </span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
          style={{ color: "var(--brand-orange)" }}
        />
      </button>

      {/* Coupons Slider */}
      {isExpanded && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {coupons.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No coupons available
            </div>
          ) : coupons.length === 1 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div
                className="flex items-start justify-between"
                style={{ borderLeft: `4px solid var(--brand-orange)` }}
              >
                <div className="pl-3 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-lg font-bold"
                      style={{ color: "var(--brand-orange)" }}
                    >
                      ₹{formatDiscount(coupons[0].coupon.value)} OFF
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-black mb-1">
                    Code:{" "}
                    <span className="font-mono">{coupons[0].coupon.code}</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    {coupons[0].coupon.description}
                  </p>
                  {/* <p className="text-xs text-gray-500 mt-2">
                    Usage: {coupons[0].coupon.usedCount}/
                    {coupons[0].coupon.usagePerUser}
                  </p> */}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(coupons[0].coupon.code);
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--brand-orange)" }}
                >
                  Copy
                </button>
              </div>
            </div>
          ) : (
            // Multiple coupons - show as horizontal slider
            <div
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin"
              style={{ scrollBehavior: "smooth" }}
            >
              {coupons.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{ borderLeft: `4px solid var(--brand-orange)` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-lg font-bold"
                          style={{ color: "var(--brand-orange)" }}
                        >
                          ₹{formatDiscount(item.coupon.value)} OFF
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-black mb-1">
                        Code:{" "}
                        <span className="font-mono">{item.coupon.code}</span>
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.coupon.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Usage: {item.coupon.usedCount}/
                        {item.coupon.usagePerUser}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.coupon.code);
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded text-white transition-opacity hover:opacity-90 flex-shrink-0 ml-2"
                      style={{ backgroundColor: "var(--brand-orange)" }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
