"use client";

import { USERS } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, User, Mail, Book, Calendar } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const user = USERS[0]; // Mock logged in user

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Link>

        <Card className="overflow-hidden">
            <div className="h-32 bg-primary/10"></div>
            <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6">
                    <Avatar className="h-32 w-32 border-4 border-card shadow-lg">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">{user.program}</p>
                    </div>

                    <div className="grid gap-4">
                        <div className="flex items-center p-4 rounded-lg border bg-muted/30">
                            <Mail className="h-5 w-5 text-primary mr-4" />
                            <div>
                                <p className="text-sm font-medium">Email Address</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 rounded-lg border bg-muted/30">
                            <Book className="h-5 w-5 text-primary mr-4" />
                            <div>
                                <p className="text-sm font-medium">Student ID</p>
                                <p className="text-sm text-muted-foreground">{user.id.toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 rounded-lg border bg-muted/30">
                            <Calendar className="h-5 w-5 text-primary mr-4" />
                            <div>
                                <p className="text-sm font-medium">Year Level</p>
                                <p className="text-sm text-muted-foreground">{user.year}st Year</p>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full" variant="outline">Edit Profile</Button>
                </div>
            </div>
        </Card>
    </div>
  );
}
