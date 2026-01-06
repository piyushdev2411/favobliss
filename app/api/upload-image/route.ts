import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

const storageZone = process.env.BUNNY_STORAGE_ZONE!;
const storageApiKey = process.env.BUNNY_STORAGE_API_KEY!;
const imagesHostname = process.env.BUNNY_IMAGES_HOSTNAME!;
const region = process.env.BUNNY_STORAGE_REGION || "";

const sanitizeFilename = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const name = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase();
  return `${name}.${extension}`;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message:
            "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeFilename(file.name);
    const uniqueId = nanoid();
    const path = "images";
    const nameWithoutExtension = sanitizedName.replace(/\.[^/.]+$/, "");
    const extension = sanitizedName.split(".").pop()!;
    const filename = `${nameWithoutExtension}-${uniqueId}.${extension}`;
    const checkUrl = `https://${region}storage.bunnycdn.com/${storageZone}/${path}/${filename}`;
    const checkRes = await fetch(checkUrl, {
      method: "HEAD",
      headers: { AccessKey: storageApiKey },
    });

    if (checkRes.ok) {
      return NextResponse.json(
        {
          message: "File with this name already exists. Try a different name.",
        },
        { status: 409 }
      );
    }

    const uploadUrl = `https://${region}storage.bunnycdn.com/${storageZone}/${path}/${filename}`;
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: storageApiKey,
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.status}`);
    }

    const imageUrl = `https://${imagesHostname}/${path}/${filename}`;
    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Image Upload Error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
