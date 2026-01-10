"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Bell, FileText, Download } from "lucide-react";
import { NotesWidget } from "@/components/NotesWidget";
import { ModeToggle } from "@/components/mode-toggle";
import { COURSES, USERS } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const user = USERS[0];
  const [recentFiles, setRecentFiles] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/files")
        .then(res => res.json())
        .then(data => setRecentFiles(data.files.slice(0, 3))) // Only show top 3
        .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b">
        <div className="flex items-center gap-4">
            <Link href="/profile">
                <Avatar className="h-12 w-12 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>SL</AvatarFallback>
                </Avatar>
            </Link>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name} 👋</h1>
                <p className="text-muted-foreground">{user.program} - Year {user.year}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full"></span>
            </Button>
            <ModeToggle />
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                    <div className="text-2xl font-bold">{COURSES.length}</div>
                </div>
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                </div>
            </CardContent>
        </Card>
        {/* Add more stats here */}
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">My Courses</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {COURSES.map((course) => (
              <Card key={course.id} className="group hover:shadow-md transition-all border-primary/10 hover:border-primary/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                        <span>{course.schedule}</span>
                        <span>{course.progress}% Complete</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mb-4">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <Link href={`/courses/${course.id}`}>
                        <Button className="w-full">View Modules</Button>
                    </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Files</h2>
              <Link href="/files" className="text-sm text-primary hover:underline">Manage Files</Link>
            </div>
            
            {recentFiles.length > 0 ? (
                <div className="grid gap-3">
                    {recentFiles.map((file) => (
                        <div key={file.name} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(file.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <a href={`/uploads/${file.name}`} download>
                                <Button variant="ghost" size="icon">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground bg-muted/30">
                    No recent files uploaded.
                </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <NotesWidget />
          
          <Card>
            <CardHeader>
                <CardTitle className="text-base">Upcoming Due Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-orange-500"></div>
                    <div>
                        <p className="font-medium">Risk Assessment Essay</p>
                        <p className="text-muted-foreground">TPC 102 • Due Friday</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}