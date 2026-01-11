"use client";

import { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/canvasUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Mail, Book, Calendar, Camera, Loader2, ZoomIn, ZoomOut, Edit2, Check, X as XIcon, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  
  // Crop state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  useEffect(() => {
    fetch("/api/user")
        .then(res => res.json())
        .then(data => {
            setUser(data);
            setNewName(data.name);
            setLoading(false);
        });
  }, []);

  const handleNameSave = async () => {
    if (!newName.trim()) return;
    
    const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName })
    });
    
    if (res.ok) {
        setUser((prev: any) => ({ ...prev, name: newName }));
        setIsEditingName(false);
        // Update header logic
        // window.location.reload(); // Optional: reload to see changes in header immediately
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl as string);
      setIsCropOpen(true);
    }
  };

  const readFile = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    setUploading(true);
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      const formData = new FormData();
      formData.append("file", croppedImageBlob as Blob, "avatar.jpg");

      const res = await fetch("/api/profile/upload", {
          method: "POST",
          body: formData
      });
      const data = await res.json();

      if (res.ok) {
          setUser((prev: any) => ({ ...prev, avatar: data.url }));
          localStorage.setItem("shelly-avatar", data.url);
          setIsCropOpen(false);
          window.location.reload(); 
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-rose-500">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
        <Link href="/" className="inline-flex items-center text-sm text-rose-600 hover:text-rose-800 transition-colors font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Link>

        <Card className="overflow-hidden bg-white/90 backdrop-blur border-pink-200">
            <div className="h-32 bg-gradient-to-r from-pink-200 to-rose-200"></div>
            <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6 w-32 mx-auto md:mx-0">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-background">
                        <AvatarImage src={user.avatar} className="object-cover" />
                        <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    
                    <label className="absolute bottom-0 right-0 p-2 bg-rose-500 text-white rounded-full cursor-pointer hover:bg-rose-600 transition-colors shadow-sm ring-2 ring-white">
                        <Camera className="h-4 w-4" />
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={onFileChange}
                        />
                    </label>
                </div>

                <div className="space-y-6 text-center md:text-left">
                    <div>
                        {isEditingName ? (
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <input 
                                    className="text-2xl font-bold border-b-2 border-rose-300 outline-none bg-transparent w-full max-w-md"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    autoFocus
                                />
                                <Button size="icon" variant="ghost" onClick={handleNameSave} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                    <Check className="h-5 w-5" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => setIsEditingName(false)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <XIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 justify-center md:justify-start group">
                                <h1 className="text-3xl font-bold text-rose-950">{user.name}</h1>
                                <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-rose-400 hover:bg-rose-50 rounded">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        <p className="text-rose-600 font-medium">{user.program} - {user.section}</p>
                    </div>

                    <div className="grid gap-4 text-left">
                        <div className="flex items-center p-4 rounded-xl border border-pink-100 bg-pink-50/50">
                            <Mail className="h-5 w-5 text-rose-500 mr-4" />
                            <div>
                                <p className="text-xs font-bold text-rose-400 uppercase tracking-wide">Email Address</p>
                                <p className="text-sm font-medium text-rose-900">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 rounded-xl border border-pink-100 bg-pink-50/50">
                            <Book className="h-5 w-5 text-rose-500 mr-4" />
                            <div>
                                <p className="text-xs font-bold text-rose-400 uppercase tracking-wide">Student No</p>
                                <p className="text-sm font-medium text-rose-900">{user.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 rounded-xl border border-pink-100 bg-pink-50/50">
                            <Calendar className="h-5 w-5 text-rose-500 mr-4" />
                            <div>
                                <p className="text-xs font-bold text-rose-400 uppercase tracking-wide">Term & Year</p>
                                <p className="text-sm font-medium text-rose-900">Term: 2526/1T • Year: {user.year}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>

        {/* CROP DIALOG */}
        <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Adjust Profile Picture</DialogTitle>
                </DialogHeader>
                
                <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden mt-4">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            cropShape="round"
                            showGrid={false}
                        />
                    )}
                </div>

                <div className="flex items-center gap-4 py-4">
                    <ZoomOut className="h-4 w-4 text-muted-foreground" />
                    <Slider 
                        value={[zoom]} 
                        min={1} 
                        max={3} 
                        step={0.1} 
                        onValueChange={(vals) => setZoom(vals[0])} 
                    />
                    <ZoomIn className="h-4 w-4 text-muted-foreground" />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCropOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveCrop} disabled={uploading}>
                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save & Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}