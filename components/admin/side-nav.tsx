"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  Home,
  Package,
  Layers,
  Palette,
  Ruler,
  Tag,
  ShoppingCart,
  FileText,
  Settings,
  MapPin,
  Group,
  Star,
  Monitor,
  List,
  Clipboard,
  Ticket,
  User,
} from "lucide-react";

export const SideNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = useMemo(
    () => [
      {
        href: `/admin`,
        label: "Overview",
        active: pathname === `/admin`,
        icon: Home,
      },
      {
        href: `/admin/users`,
        label: "Users",
        active: pathname === `/admin/users`,
        icon: User,
      },
      {
        href: `/admin/categories`,
        label: "Categories",
        active: pathname === `/admin/categories`,
        icon: Layers,
      },
      {
        href: `/admin/homepage-categories`,
        label: "Homepage Categories",
        active: pathname === `/admin/homepage-categories`,
        icon: Layers,
      },
      {
        href: `/admin/hot-product`,
        label: "Hot Products",
        active: pathname === `/admin/hot-product`,
        icon: Layers,
      },
      {
        href: `/admin/subcategories`,
        label: "Subcategories",
        active: pathname === `/admin/subcategories`,
        icon: List,
      },
      {
        href: `/admin/sizes`,
        label: "Sizes",
        active: pathname === `/admin/sizes`,
        icon: Ruler,
      },
      {
        href: `/admin/colors`,
        label: "Colors",
        active: pathname === `/admin/colors`,
        icon: Palette,
      },
      {
        href: `/admin/brands`,
        label: "Brands",
        active: pathname === `/admin/brands`,
        icon: Tag,
      },
      {
        href: `/admin/products`,
        label: "Products",
        active: pathname === `/admin/products`,
        icon: Package,
      },
      {
        href: `/admin/specification-groups`,
        label: "Specification Groups",
        active: pathname === `/admin/specification-groups`,
        icon: Clipboard,
      },
      {
        href: `/admin/specification-fields`,
        label: "Specification Fields",
        active: pathname === `/admin/specification-fields`,
        icon: FileText,
      },
      {
        href: `/admin/orders`,
        label: "Orders",
        active: pathname === `/admin/orders`,
        icon: ShoppingCart,
      },
      {
        href: `/admin/reviews`,
        label: "Reviews",
        active: pathname === `/admin/reviews`,
        icon: Star,
      },
      {
        href: `/admin/coupons`,
        label: "Coupons",
        active: pathname === `/admin/coupons`,
        icon: Ticket,
      },
      {
        href: `/admin/location`,
        label: "Locations",
        active: pathname === `/admin/location`,
        icon: MapPin,
      },
      {
        href: `/admin/location-group`,
        label: "Location Groups",
        active: pathname === `/admin/location-group`,
        icon: Group,
      },
      {
        href: `/admin/blog`,
        label: "Blog",
        active: pathname === `/admin/blog`,
        icon: Monitor,
      },
      // {
      //   href: `/admin/settings`,
      //   label: "Settings",
      //   active: pathname === `/admin/settings`,
      //   icon: Settings,
      // },
    ],
    [pathname, params]
  );

  return (
    <nav className={cn("space-y-1 px-2", className)} {...props}>
      {routes.map((route) => {
        const Icon = route.icon;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group relative",
              route.active
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            {route.active && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-400 rounded-r-md" />
            )}
            <Icon
              className={cn(
                "h-5 w-5 transition-colors flex-shrink-0",
                route.active
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
              )}
            />
            <span className="truncate">{route.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
