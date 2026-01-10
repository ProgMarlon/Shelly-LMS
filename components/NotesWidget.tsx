"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NotesWidget() {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!note.trim()) return;
    
    setSaving(true);
    try {
        await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: note })
        });
        setNote(""); // Clear input
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
        console.error(e);
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow h-full flex flex-col">
      <div className="p-6 flex justify-between items-start">
        <div>
            <h3 className="font-semibold leading-none tracking-tight">Quick Note</h3>
            <p className="text-sm text-muted-foreground pt-2">Save a thought for later.</p>
        </div>
        <Link href="/notes" className="text-xs text-primary hover:underline">View All</Link>
      </div>
      <div className="p-6 pt-0 flex-1 flex flex-col">
        <textarea 
          className="w-full flex-1 min-h-[120px] p-3 rounded-md border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-muted/30"
          placeholder="Type here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <Button 
          onClick={handleSave}
          className="mt-4 w-full"
          disabled={saving || !note.trim()}
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {success ? "Saved to Notes!" : "Save Note"}
        </Button>
      </div>
    </div>
  );
}