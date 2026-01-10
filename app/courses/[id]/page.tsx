"use client";

import { useParams } from "next/navigation";
import { COURSES } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowLeft, PlayCircle, FileText, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CoursePage() {
  const params = useParams();
  const course = COURSES.find(c => c.id === params.id) || COURSES[0];

  return (
    <div className="space-y-8">
       <div className="space-y-2">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.code} • {course.instructor}</p>
       </div>

       <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Course Modules</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {course.modules.length > 0 ? course.modules.map((module, i) => (
                            <div key={module.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-2 rounded-full", 
                                        module.type === 'video' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                                        module.type === 'quiz' ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" :
                                        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                    )}>
                                        {module.type === 'video' ? <PlayCircle className="h-5 w-5" /> :
                                         module.type === 'quiz' ? <CheckCircle className="h-5 w-5" /> :
                                         <FileText className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium group-hover:text-primary transition-colors">{module.title}</h4>
                                        <p className="text-sm text-muted-foreground capitalize">{module.type} • {module.duration}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">Start</Button>
                            </div>
                        )) : (
                            <p className="text-muted-foreground text-center py-8">No modules available yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="bg-primary text-primary-foreground border-none">
                    <CardHeader>
                        <CardTitle className="text-lg">Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-2">{course.progress}%</div>
                        <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <p className="text-xs mt-2 opacity-80">Keep it up! You're doing great.</p>
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle className="text-lg">Instructor</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                            {course.instructor.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium">{course.instructor}</p>
                            <p className="text-xs text-muted-foreground">Course Head</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">Message</Button>
                    </CardContent>
                </Card>
            </div>
       </div>
    </div>
  );
}
