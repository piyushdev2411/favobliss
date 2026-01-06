"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PincodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationGroups: any[]; // Replace with your actual type
  children?: React.ReactNode; // For trigger if needed
}

const PincodeDialog = ({
  open,
  onOpenChange,
  locationGroups,
  children,
}: PincodeDialogProps) => {
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getFallbackGroup = () => {
    return locationGroups.find((group) =>
      group.locations.some((loc: any) => loc.pincode === "110040")
    );
  };

  const handlePincodeCheck = async () => {
    if (pincode.trim()) {
      setIsLoading(true);

      const foundGroup = locationGroups.find((group) =>
        group.locations.some((loc: any) => loc.pincode === pincode.trim())
      );
      const foundLocation = foundGroup?.locations.find(
        (loc: any) => loc.pincode === pincode.trim()
      );

      if (foundGroup && foundLocation) {
        // Store the valid pincode data
        const locationData = {
          city: foundLocation.city,
          state: foundLocation.state,
          country: foundLocation.country || "India",
          pincode: foundLocation.pincode,
        };
        localStorage.setItem("locationData", JSON.stringify(locationData));
        window.dispatchEvent(new Event("locationDataUpdated"));

        // Reload the page after a brief delay to ensure storage is updated
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        // No group found, fallback to 110040
        const fallbackGroup = getFallbackGroup();
        const fallbackLocation = fallbackGroup
          ? {
              city: fallbackGroup.locations[0]?.city || "Delhi",
              state: fallbackGroup.locations[0]?.state || "Delhi",
              country: fallbackGroup.locations[0]?.country || "India",
              pincode: fallbackGroup.locations[0]?.pincode || "110040",
            }
          : null;
        if (fallbackLocation) {
          localStorage.setItem(
            "locationData",
            JSON.stringify(fallbackLocation)
          );
          window.dispatchEvent(new Event("locationDataUpdated"));

          // Reload the page after a brief delay
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          // If no fallback available, just close dialog
          setPincode(""); // Reset input
          onOpenChange(false); // Close dialog
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Pincode</DialogTitle>
          <DialogDescription>
            Check availability by entering your pincode.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          disabled={isLoading}
        />
        <DialogFooter>
          <Button
            onClick={handlePincodeCheck}
            disabled={!pincode.trim() || isLoading}
            className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isLoading ? "Checking..." : "Check"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PincodeDialog;
