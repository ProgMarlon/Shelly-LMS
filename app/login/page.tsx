"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
        router.push("/");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-10 shadow-lg"
      >
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Shelly LMS</h1>
            <p className="text-muted-foreground">Welcome back! Please sign in.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input 
                        type="email" 
                        placeholder="student@sti.edu" 
                        className="w-full rounded-md border bg-background pl-9 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full rounded-md border bg-background pl-9 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                        required
                    />
                </div>
            </div>

            <Button className="w-full" size="lg" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
            </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="#" className="text-primary hover:underline">Contact Admin</Link>
        </div>
      </motion.div>
    </div>
  );
}
