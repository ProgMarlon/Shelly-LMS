import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const directoryPath = path.join(process.cwd(), "public/uploads");
  try {
    if (!fs.existsSync(directoryPath)) {
        return NextResponse.json({ files: [] });
    }
    
    const fileNames = fs.readdirSync(directoryPath);
    
    const files = fileNames.map(name => {
        const stats = fs.statSync(path.join(directoryPath, name));
        return {
            name,
            createdAt: stats.birthtime,
            size: stats.size
        };
    });

    // Sort by newest first
    files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json({ files: [] });
  }
}