import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const newQuiz = {
      id: Date.now().toString(),
      title: body.title,
      questions: body.questions, // Array of { type, question, options, answer }
      createdAt: new Date().toISOString()
  };

  db.addQuiz(id, newQuiz);
  return NextResponse.json({ quiz: newQuiz, status: 200 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    
    db.saveQuizResult(id, body.quizId, body.score);
    return NextResponse.json({ success: true });
}
