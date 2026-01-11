import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  // Validation
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload JPG or PNG." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `avatar-${Date.now()}${path.extname(file.name)}`;
  const uploadDir = path.join(process.cwd(), "public/uploads/avatars");
  
  if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
  }

  try {
    await writeFile(path.join(uploadDir, filename), buffer);
    return NextResponse.json({ 
        url: `/uploads/avatars/${filename}`, 
        status: 200 
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}
