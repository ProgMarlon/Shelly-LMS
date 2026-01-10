"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
    "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-800",
    "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800",
    "bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800",
    "bg-pink-100 dark:bg-pink-900/40 border-pink-200 dark:border-pink-800",
    "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800",
];

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
  };

  const handleCreate = async () => {
    if (!newNote.trim()) return;
    setLoading(true);
    await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ content: newNote, color: selectedColor })
    });
    setNewNote("");
    setLoading(false);
    fetchNotes();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    fetchNotes();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/" className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
            <p className="text-muted-foreground">Capture your ideas and reminders</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Create Note Section */}
        <Card className="h-fit">
            <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Add New Note</h3>
                <textarea 
                    className={cn("w-full h-32 p-3 rounded-md border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors", selectedColor)}
                    placeholder="Type something..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                />
                
                <div className="flex gap-2">
                    {COLORS.map((color, i) => (
                        <button 
                            key={i}
                            className={cn("w-6 h-6 rounded-full border-2 transition-transform hover:scale-110", color.split(' ')[0], selectedColor === color ? "ring-2 ring-primary ring-offset-2" : "border-transparent")}
                            onClick={() => setSelectedColor(color)}
                        />
                    ))}
                </div>

                <Button className="w-full" onClick={handleCreate} disabled={loading || !newNote.trim()}>
                    <Plus className="h-4 w-4 mr-2" /> Add Note
                </Button>
            </CardContent>
        </Card>

        {/* Notes Grid */}
        <div className="md:col-span-2">
            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-xl">
                    <StickyNote className="h-12 w-12 mb-4 opacity-20" />
                    <p>No notes yet. Create your first one!</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                    {notes.map((note: any) => (
                        <div key={note.id} className={cn("p-5 rounded-xl border relative group transition-all hover:shadow-md", note.color)}>
                            <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                            <p className="text-[10px] opacity-60 mt-4 text-right">
                                {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                            <button 
                                onClick={() => handleDelete(note.id)}
                                className="absolute top-2 right-2 p-1.5 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
