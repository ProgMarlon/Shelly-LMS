import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
  const uploadDir = path.join(process.cwd(), "public/uploads/courses", id);
  
  if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
  }

  try {
    await writeFile(path.join(uploadDir, filename), buffer);
    
    const newMaterial = {
        id: Date.now().toString(),
        title: file.name,
        type: file.name.endsWith(".pdf") ? "pdf" : "file",
        url: `/uploads/courses/${id}/${filename}`,
        date: new Date().toISOString()
    };

    db.addMaterial(id, newMaterial);

    return NextResponse.json({ material: newMaterial, status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
