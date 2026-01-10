"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, FileText, ArrowLeft, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Files</h1>
                <p className="text-muted-foreground">Manage your course materials</p>
            </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-dashed border-2 shadow-none bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center h-full">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Upload New File</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                    Support for PDF, DOCX, PPTX, and Images. Max file size 10MB.
                </p>
                <div className="relative">
                    <Button size="lg" disabled={uploading}>
                        {uploading ? "Uploading..." : "Select File to Upload"}
                    </Button>
                    <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleUpload} 
                        disabled={uploading}
                    />
                </div>
            </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground border-none">
            <CardHeader>
                <CardTitle>Storage Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold mb-2">{files.length}</div>
                <p className="text-sm opacity-90 mb-6">Files Uploaded</p>
                <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-1/4"></div>
                </div>
                <p className="text-xs mt-2 opacity-80">Locally stored on this device.</p>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Uploads</h2>
        {files.length === 0 ? (
          <div className="text-center py-12 rounded-xl border bg-card">
            <p className="text-muted-foreground">No files found. Upload your first one above!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {files.map((file) => (
              <Card key={file} className="group hover:shadow-md transition-all overflow-hidden">
                 <div className="aspect-[4/3] bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                 </div>
                 <CardContent className="p-4">
                    <h4 className="font-medium truncate mb-1" title={file}>{file}</h4>
                    <p className="text-xs text-muted-foreground mb-4">Just now</p>
                    <div className="flex gap-2">
                        <a href={`/uploads/${file}`} download className="flex-1">
                            <Button variant="secondary" size="sm" className="w-full">
                                <Download className="h-4 w-4 mr-2" /> Open
                            </Button>
                        </a>
                    </div>
                 </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
