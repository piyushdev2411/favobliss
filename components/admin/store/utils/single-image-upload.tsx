"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlusIcon, Trash } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export const SingleImageUpload = ({
  value,
  disabled,
  onChange,
  onRemove,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Upload failed");
      }
      const { url } = await res.json();
      onChange(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
     toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  const onButtonClick = () => {
    if (!loading && !value && !disabled) {
      fileInputRef.current?.click();
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value && (
          <div className="relative w-[200px] h-[220px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={onRemove}
                disabled={disabled}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={value} />
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        disabled={disabled || loading || !!value}
      />
      <Button
        type="button"
        disabled={disabled || loading || !!value}
        onClick={onButtonClick}
        variant="secondary"
      >
        <ImagePlusIcon className="h-4 w-4 mr-2" />
        {loading ? "Uploading..." : "Upload an Image"}
      </Button>
    </div>
  );
};
