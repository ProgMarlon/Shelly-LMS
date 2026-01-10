import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await (file as File).arrayBuffer());
  const filename = (file as File).name.replaceAll(" ", "_");
  
  const uploadDir = path.join(process.cwd(), "public/uploads");
  
  if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
  }

  try {
    await writeFile(
      path.join(uploadDir, filename),
      buffer
    );
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
}
