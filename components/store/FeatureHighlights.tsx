import React from "react";
import { Truck, CreditCard, ShieldCheck, Headphones } from "lucide-react";

const FeatureHighlights = () => {
  const features = [
    {
      id: 1,
      title: "Free Shipping",
      description: "On orders above ₹499",
      icon: Truck,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-white",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Flexible Payment",
      description: "Multiple payment options",
      icon: CreditCard,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-white",
      iconColor: "text-purple-600",
    },
    {
      id: 3,
      title: "Authentic Products",
      description: "100% genuine guarantee",
      icon: ShieldCheck,
      color: "from-green-500 to-green-600",
      bgColor: "bg-white",
      iconColor: "text-green-600",
    },
    {
      id: 4,
      title: "Convenient Help",
      description: "24/7 customer support",
      icon: Headphones,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-white",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className={`${feature.bgColor} rounded-2xl p-5 md:p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className={`p-3 md:p-4 rounded-full bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-sm md:text-base lg:text-lg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureHighlights;
