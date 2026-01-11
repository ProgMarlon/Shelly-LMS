import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    return NextResponse.json(db.getUser());
}

export async function PATCH(req: Request) {
    const body = await req.json();
    const updatedUser = db.updateUser(body);
    return NextResponse.json(updatedUser);
}
