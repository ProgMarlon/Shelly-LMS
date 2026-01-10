import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const directoryPath = path.join(process.cwd(), "public/uploads");
  try {
    if (!fs.existsSync(directoryPath)) {
        return NextResponse.json({ files: [] });
    }
    const files = fs.readdirSync(directoryPath);
    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json({ files: [] });
  }
}
