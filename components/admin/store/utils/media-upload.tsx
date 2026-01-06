"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlusIcon, Trash, Grip } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface MediaUploadProps {
  value: Array<{ url: string; mediaType: "IMAGE" | "VIDEO" }>;
  disabled: boolean;
  onChange: (
    value: Array<{ url: string; mediaType: "IMAGE" | "VIDEO" }>
  ) => void;
  onRemove: (url: string) => void;
}

interface SortableMediaItemProps {
  media: { url: string; mediaType: "IMAGE" | "VIDEO" };
  index: number;
  disabled: boolean;
  loading: boolean;
  onRemove: (url: string) => void;
}

const SortableMediaItem = ({
  media,
  index,
  disabled,
  loading,
  onRemove,
}: SortableMediaItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: media.url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative w-[200px] h-[220px] rounded-md overflow-hidden border-2 border-transparent transition"
    >
      <div
        {...listeners}
        className="z-10 absolute top-2 left-2 cursor-grab active:cursor-grabbing"
      >
        <span className="bg-white p-1 flex rounded-lg">
          <Grip className="h-5 w-5 text-black" />
        </span>
      </div>
      <div className="z-10 absolute top-2 right-2">
        <Button
          variant="destructive"
          size="icon"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(media.url);
          }}
          disabled={disabled || loading}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      {media.mediaType === "VIDEO" ? (
        <video
          src={media.url}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <Image
          fill
          className="object-cover"
          alt="Uploaded image"
          src={media.url}
        />
      )}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {media.mediaType}
      </div>
    </div>
  );
};

export const MediaUpload = ({
  value: initialValue,
  disabled,
  onChange,
  onRemove,
}: MediaUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<"IMAGE" | "VIDEO">(
    "IMAGE"
  );
  const [loading, setLoading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setUploadQueue([]);
    };
  }, []);

  const handleUpload = async (files: FileList) => {
    setLoading(true);
    const newQueue = Array.from(files).map((f) => f.name);
    setUploadQueue(newQueue);

    const uploadedItems: Array<{ url: string; mediaType: "IMAGE" | "VIDEO" }> =
      [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const apiEndpoint =
          selectedMediaType === "IMAGE"
            ? "/api/upload-image"
            : "/api/upload-video";
        const res = await fetch(apiEndpoint, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message || "Upload failed");
        }
        const { url } = await res.json();
        uploadedItems.push({ url, mediaType: selectedMediaType });
        toast.success(
          `${selectedMediaType.toLowerCase()} uploaded successfully`
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : `Failed to upload ${selectedMediaType.toLowerCase()}`
        );
        console.error("Upload error:", error);
      } finally {
        setUploadQueue((prev) => prev.filter((name) => name !== file.name));
      }
    }

    // Update state with all uploaded items and preserve existing ones
    if (uploadedItems.length > 0) {
      onChange([...initialValue, ...uploadedItems]);
    }

    if (uploadQueue.length === 0) {
      setLoading(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = initialValue.findIndex((item) => item.url === active.id);
    const newIndex = initialValue.findIndex((item) => item.url === over.id);

    const reorderedMedia = [...initialValue];
    const [movedItem] = reorderedMedia.splice(oldIndex, 1);
    reorderedMedia.splice(newIndex, 0, movedItem);

    onChange(reorderedMedia);
  };

  const onButtonClick = () => {
    if (!loading && !disabled) {
      fileInputRef.current?.click();
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={initialValue.map((item) => item.url)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="mb-4 flex items-center gap-4 flex-wrap">
            {initialValue.map((media, index) => (
              <SortableMediaItem
                key={media.url}
                media={media}
                index={index}
                disabled={disabled}
                loading={loading}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="flex items-center gap-4">
        <Select
          value={selectedMediaType}
          onValueChange={(value: "IMAGE" | "VIDEO") => {
            setSelectedMediaType(value);
            setUploadQueue([]);
          }}
          disabled={disabled || loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select media type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IMAGE">Image</SelectItem>
            <SelectItem value="VIDEO">Video</SelectItem>
          </SelectContent>
        </Select>
        <input
          ref={fileInputRef}
          type="file"
          accept={selectedMediaType === "VIDEO" ? "video/*" : "image/*"}
          multiple
          onChange={(e) => handleUpload(e.target.files!)}
          className="hidden"
          disabled={disabled || loading}
        />
        <Button
          type="button"
          disabled={disabled || loading}
          onClick={onButtonClick}
          variant="secondary"
        >
          <ImagePlusIcon className="h-4 w-4 mr-2" />
          {loading
            ? "Uploading..."
            : `Upload ${selectedMediaType === "VIDEO" ? "Video" : "Image"}`}
        </Button>
      </div>
      {uploadQueue.length > 0 && (
        <p className="text-sm text-muted-foreground mt-2">
          Uploading: {uploadQueue.join(", ")}
        </p>
      )}
    </div>
  );
};
