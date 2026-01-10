import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data/notes.json");

// Helper to read notes
function getNotes() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data || "[]");
}

// Helper to save notes
function saveNotes(notes: any[]) {
    // Ensure data directory exists
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

export async function GET() {
    return NextResponse.json(getNotes());
}

export async function POST(req: Request) {
    const body = await req.json();
    const notes = getNotes();
    
    const newNote = {
        id: Date.now().toString(),
        content: body.content,
        color: body.color || "bg-yellow-200 dark:bg-yellow-900",
        createdAt: new Date().toISOString()
    };
    
    notes.unshift(newNote); // Add to top
    saveNotes(notes);
    
    return NextResponse.json(newNote);
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    let notes = getNotes();
    notes = notes.filter((n: any) => n.id !== id);
    saveNotes(notes);
    
    return NextResponse.json({ success: true });
}
