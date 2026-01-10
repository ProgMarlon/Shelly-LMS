"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, File as FileIcon, ArrowLeft } from "lucide-react";

export default function FilesPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await fetch("/api/files");
    const data = await res.json();
    setFiles(data.files);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        fetchFiles();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">File Management</h1>
      </div>

      <div className="rounded-xl border bg-card p-8 text-center border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Upload className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Upload a file</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Drag and drop or click to upload relevant course materials.
          </p>
          <label className="relative cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <span>Select File</span>
            <input 
              type="file" 
              className="sr-only" 
              onChange={handleUpload} 
              disabled={uploading}
            />
          </label>
          {uploading && <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Files</h2>
        {files.length === 0 ? (
          <p className="text-muted-foreground text-sm">No files found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {files.map((file) => (
              <a 
                key={file} 
                href={`/uploads/${file}`} 
                target="_blank"
                className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                    <FileIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium truncate w-full">{file}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
