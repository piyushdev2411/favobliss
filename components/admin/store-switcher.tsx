"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoreSwitcherProps {
  className?: string;
}

export const StoreSwitcher = ({ className }: StoreSwitcherProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/"); 
  };

  return (
    <Button
    variant="secondary"
      size="sm"
      className={cn("w-[200px] gap-2 justify-start pl-0 bg-transparent font-bold text-lg hover:text-blue-700", className)}
      onClick={handleClick}
    >
      <StoreIcon className="mr-2 h-6 w-6" />
      Store
    </Button>
  );
};
