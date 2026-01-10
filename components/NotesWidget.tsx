"use client";

import { useState, useEffect } from "react";

export function NotesWidget() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem("shelly-lms-notes");
    if (savedNote) setNote(savedNote);
  }, []);

  const handleSave = () => {
    localStorage.setItem("shelly-lms-notes", note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow h-full flex flex-col">
      <div className="p-6">
        <h3 className="font-semibold leading-none tracking-tight">Quick Notes</h3>
        <p className="text-sm text-muted-foreground pt-2">Jot down reminders. (Saved locally)</p>
      </div>
      <div className="p-6 pt-0 flex-1 flex flex-col">
        <textarea 
          className="w-full flex-1 min-h-[150px] p-2 rounded-md border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-transparent"
          placeholder="Type your notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <button 
          onClick={handleSave}
          className="mt-4 w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-3 text-sm font-medium transition-colors"
        >
          {saved ? "Saved!" : "Save Note"}
        </button>
      </div>
    </div>
  );
}
