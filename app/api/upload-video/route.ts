import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID!;
const streamApiKey = process.env.BUNNY_STREAM_API_KEY!;
const videosHostname = process.env.BUNNY_VIDEOS_HOSTNAME!;

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
        { message: "No video file provided" },
        { status: 400 }
      );
    }

    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only MP4, WebM, and MOV are allowed." },
        { status: 400 }
      );
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File size exceeds 100MB limit." },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeFilename(file.name);
    const uniqueId = nanoid();
    const nameWithoutExtension = sanitizedName.replace(/\.[^/.]+$/, "");
    const title = `${nameWithoutExtension}-${uniqueId}`;

    const checkRes = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos?search=${encodeURIComponent(
        title
      )}`,
      {
        method: "GET",
        headers: {
          AccessKey: streamApiKey,
          Accept: "application/json",
        },
      }
    );

    if (!checkRes.ok) {
      throw new Error(`Failed to check video title: ${checkRes.status}`);
    }

    const { items } = await checkRes.json();
    if (items && items.some((video: any) => video.title === title)) {
      return NextResponse.json(
        {
          message:
            "Video with this title already exists. Try a different name.",
        },
        { status: 409 }
      );
    }

    // Step 1: Create video object
    const createRes = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
      {
        method: "POST",
        headers: {
          AccessKey: streamApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ title }),
      }
    );

    if (!createRes.ok) {
      throw new Error(`Failed to create video: ${createRes.status}`);
    }

    const { guid: videoId } = await createRes.json();

    // Step 2: Upload file
    const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: streamApiKey,
        Accept: "application/json",
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.status}`);
    }

    // Construct MP4 URL (assumes MP4 Fallback enabled)
    const videoUrl = `https://${videosHostname}/${videoId}/play_720p.mp4`;
    return NextResponse.json({ url: videoUrl }, { status: 200 });
  } catch (error) {
    console.error("Video Upload Error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
