import Link from "next/link";
import { BookOpen } from "lucide-react";
import { NotesWidget } from "@/components/NotesWidget";

export default function Home() {
  const courses = [
    { id: 1, title: "Macro Perspective of Tourism", code: "TPC 101" },
    { id: 2, title: "Risk Management as Applied to Safety", code: "TPC 102" },
    { id: 3, title: "Multicultural Diversity in Workplace", code: "TPC 103" },
    { id: 4, title: "Tourism & Hospitality Marketing", code: "TPC 104" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, Shelly 👋</h1>
          <p className="text-muted-foreground">BS Tourism Management - Year 1</p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Courses</h3>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">4</div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">My Courses</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((course) => (
              <div key={course.id} className="group relative rounded-lg border p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-muted-foreground">{course.code}</p>
                <div className="mt-4 flex gap-2">
                  <button className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90">
                    View Modules
                  </button>
                </div>
              </div>
            ))}
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Files</h2>
              <Link href="/files" className="text-sm text-primary hover:underline">Manage Files</Link>
            </div>
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              No recent files uploaded.
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <NotesWidget />
        </div>
      </div>
    </div>
  );
}
