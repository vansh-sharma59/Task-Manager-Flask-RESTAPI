"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  Settings, 
  Calendar,
  Loader2 
} from "lucide-react";

export default function MePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      setError("Failed to fetch user info. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-4">
        <p className="text-red-600 font-medium">{error}</p>
        <Button onClick={() => router.push("/auth/login")}>Back to Login</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and account preferences.</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 capitalize">
          {user.role} Account
        </Badge>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 pb-8">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold border-4 border-background shadow-sm">
              {(user.username || user.name || "U")[0].toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-2xl">{user.username || user.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> User ID: {user.id || user.user_id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-3 rounded-lg border bg-card">
              <div className="p-2 bg-blue-100 rounded-md">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Full Name / Username</p>
                <p className="font-medium">{user.username || user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg border bg-card">
              <div className="p-2 bg-green-100 rounded-md">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg border bg-card">
              <div className="p-2 bg-purple-100 rounded-md">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Role Access</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="flex justify-between p-6 bg-muted/10">
          <div className="flex items-center text-sm text-muted-foreground">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile coming soon
          </div>
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </CardFooter>
      </Card>

      {user.role === "admin" && (
        <Card className="border-yellow-200 bg-yellow-50/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">You have administrative access to this system.</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => router.push("/admin/dashboard")}>
              Go to Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}