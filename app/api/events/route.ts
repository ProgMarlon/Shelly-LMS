import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");

// Helper to read events
function getEvents() {
    if (!fs.existsSync(EVENTS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(EVENTS_FILE, "utf-8");
    return JSON.parse(data || "[]");
}

// Helper to save events
function saveEvents(events: any[]) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}

export async function GET() {
    let events = getEvents();
    // Sort by date (soonest first)
    events.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return Response.json(events);
}

export async function POST(req: Request) {
    const body = await req.json();
    const events = getEvents();
    
    const newEvent = {
        id: Date.now().toString(),
        title: body.title,
        course: body.course,
        date: body.date, // "YYYY-MM-DD"
        color: body.color || "bg-rose-500"
    };
    
    events.push(newEvent);
    saveEvents(events);
    
    return Response.json(newEvent);
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    let events = getEvents();
    events = events.filter((e: any) => e.id !== id);
    saveEvents(events);
    
    return Response.json({ success: true });
}
