"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Bell, FileText, Download, Heart, Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { NotesWidget } from "@/components/NotesWidget";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  
  // Event Form State
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventCourse, setNewEventCourse] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  useEffect(() => {
    // Fetch User
    fetch("/api/user")
        .then(res => res.json())
        .then(data => {
            setUser(data);
            const savedAvatar = localStorage.getItem("shelly-avatar");
            if (savedAvatar) {
                setUser((prev: any) => ({ ...prev, avatar: savedAvatar }));
            }
        });

    // Fetch Courses
    fetch("/api/courses").then(res => res.json()).then(setCourses);

    // Fetch Files
    fetch("/api/files").then(res => res.json()).then(data => setRecentFiles(data.files.slice(0, 3)));

    // Fetch Events
    fetchEvents();
  }, []);

  const fetchEvents = () => {
      fetch("/api/events").then(res => res.json()).then(setEvents);
  };

  const handleAddEvent = async () => {
      if (!newEventTitle || !newEventDate) return;
      
      await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              title: newEventTitle,
              course: newEventCourse || "General",
              date: newEventDate
          })
      });
      
      setNewEventOpen(false);
      setNewEventTitle("");
      setNewEventCourse("");
      setNewEventDate("");
      fetchEvents();
  };

  const handleDeleteEvent = async (id: string) => {
      await fetch(`/api/events?id=${id}`, { method: "DELETE" });
      fetchEvents();
  };

  if (!user) return <div className="p-8 text-center text-rose-500">Loading...</div>;

  return (
    <div className="space-y-8 relative pb-20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] text-pink-300/40 transform rotate-12">
           <Heart className="w-64 h-64 fill-current" />
        </div>
        <div className="absolute bottom-[10%] right-[-5%] text-pink-400/30 transform -rotate-12">
           <Heart className="w-96 h-96 fill-current" />
        </div>
        {/* Floating Characters */}
        <div className="absolute top-20 right-10 animate-bounce duration-[3000ms] opacity-90">
             <Image src="/assets/char-1.png" alt="Cute Character" width={120} height={120} className="drop-shadow-lg" />
        </div>
        <div className="absolute bottom-10 left-10 animate-pulse duration-[4000ms] opacity-80">
             <Image src="/assets/char-2.png" alt="Cute Character" width={100} height={100} className="drop-shadow-md -rotate-12" />
        </div>
        <div className="absolute top-[40%] left-[-20px] opacity-70">
             <Image src="/assets/char-3.png" alt="Cute Character" width={80} height={80} className="drop-shadow-sm rotate-45" />
        </div>
        <div className="absolute bottom-40 right-20 opacity-80 hover:scale-110 transition-transform duration-500">
             <Image src="/assets/char-4.png" alt="Cute Character" width={90} height={90} className="drop-shadow-md" />
        </div>
      </div>

      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-pink-300/50 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-sm ring-1 ring-white/50">
        <div className="flex items-center gap-4">
            <Link href="/profile" className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <Avatar className="h-16 w-16 border-2 border-white relative cursor-pointer shadow-md">
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback>SL</AvatarFallback>
                </Avatar>
            </Link>
            <div className="group cursor-default">
                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-pink-100 drop-shadow-sm transition-all duration-300">
                    <span className="group-hover:hidden text-pink-outline dark:text-pink-100">
                        Hi, {user.name.split(',')[1]?.split(' ')[1] || "ROCHELLE"} 🌸
                    </span>
                    <span className="hidden group-hover:block text-pink-outline dark:text-pink-100 animate-in fade-in zoom-in duration-300">
                        Loony Loves You! &lt;3
                    </span>
                </h1>
                <p className="text-rose-900 dark:text-pink-300 font-bold">{user.program} - Year {user.year}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
             <Button variant="outline" size="icon" className="relative rounded-full border-pink-300 hover:bg-pink-100 text-rose-700 hover:text-rose-900 bg-white/50">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full animate-pulse"></span>
            </Button>
            <ModeToggle />
        </div>
      </header>

      {/* Stats Section */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/90 backdrop-blur-sm border-pink-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
                <div>
                    <p className="text-sm font-bold text-rose-600">Active Courses</p>
                    <div className="text-2xl font-black text-pink-outline dark:text-pink-100">{courses.length}</div>
                </div>
                <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center border border-pink-200">
                    <BookOpen className="h-6 w-6 text-rose-600" />
                </div>
            </CardContent>
        </Card>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-pink-outline dark:text-pink-100">My Courses</h2>
            <span className="text-2xl">🌷</span>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-all border-pink-200 bg-white/80 backdrop-blur-sm overflow-hidden hover:-translate-y-1 relative ring-1 ring-pink-100">
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Image src="/assets/char-5.png" alt="Sticker" width={40} height={40} className="rotate-12" />
                </div>
                <CardHeader className="pb-3 bg-gradient-to-r from-pink-50 to-transparent border-b border-pink-100">
                    <CardTitle className="text-lg text-rose-950 dark:text-pink-100 group-hover:text-rose-600 transition-colors font-bold line-clamp-1" title={course.title}>{course.title}</CardTitle>
                    <p className="text-sm text-rose-600 font-semibold">{course.code}</p>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-4 text-sm text-rose-700 font-medium">
                        <span>{course.schedule}</span>
                        <span>{course.room}</span>
                    </div>
                    <Link href={`/courses/${course.id}`}>
                        <Button className="w-full bg-pink-200 hover:bg-pink-300 text-rose-900 border border-pink-300 shadow-sm font-bold">
                            View Materials
                        </Button>
                    </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <h2 className="text-xl font-bold text-pink-outline dark:text-pink-100">Recent Files</h2>
                 <span className="text-xl">✨</span>
              </div>
              <Link href="/files" className="text-sm text-rose-600 hover:text-rose-800 font-bold hover:underline">Manage Files</Link>
            </div>
            
            {recentFiles.length > 0 ? (
                <div className="grid gap-3">
                    {recentFiles.map((file) => (
                        <div key={file.name} className="flex items-center justify-between p-4 rounded-xl border border-pink-200 bg-white/70 hover:bg-white hover:scale-105 hover:shadow-md transition-all duration-300 group cursor-pointer">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="h-10 w-10 bg-pink-100 rounded-xl flex items-center justify-center shrink-0 text-rose-500 border border-pink-200">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-bold truncate text-pink-outline dark:text-pink-100 group-hover:text-rose-600 transition-colors">{file.name}</p>
                                    <p className="text-xs text-rose-500 font-medium">{new Date(file.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <a href={`/uploads/${file.name}`} download>
                                <Button variant="ghost" size="icon" className="text-rose-400 hover:text-rose-600 hover:bg-pink-50 rounded-full">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border-2 border-dashed border-pink-300 p-8 text-center text-rose-400 bg-pink-50/50 font-medium">
                    No recent files uploaded yet.
                </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <NotesWidget />
          
          <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-pink-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-rose-900 font-bold">
                    <span>📅</span> Upcoming Due Dates
                </CardTitle>
                <Dialog open={newEventOpen} onOpenChange={setNewEventOpen}>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-rose-200 text-rose-600">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Event</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Event Title</label>
                                <input 
                                    className="w-full p-2 rounded-md border border-pink-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                                    placeholder="e.g., Essay Submission"
                                    value={newEventTitle}
                                    onChange={(e) => setNewEventTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Course (Optional)</label>
                                <input 
                                    className="w-full p-2 rounded-md border border-pink-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                                    placeholder="e.g., TPC 102"
                                    value={newEventCourse}
                                    onChange={(e) => setNewEventCourse(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <input 
                                    type="date"
                                    className="w-full p-2 rounded-md border border-pink-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                                    value={newEventDate}
                                    onChange={(e) => setNewEventDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddEvent} className="bg-rose-500 hover:bg-rose-600 text-white">Save Event</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
                {events.length > 0 ? events.map((event) => (
                    <div key={event.id} className="flex items-start justify-between gap-3 text-sm p-3 rounded-lg bg-white/80 border border-pink-100 group">
                        <div className="flex gap-3">
                            <div className={`h-2 w-2 mt-1.5 rounded-full ${event.color} shadow-sm`}></div>
                            <div>
                                <p className="font-bold text-rose-900">{event.title}</p>
                                <p className="text-rose-600 text-xs font-medium">{event.course} • {new Date(event.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDeleteEvent(event.id)} className="text-rose-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                )) : (
                    <div className="text-center text-xs text-rose-400 py-4">No upcoming events.</div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}