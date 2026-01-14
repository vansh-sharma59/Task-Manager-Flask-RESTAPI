"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Import Link for navigation
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  LayoutList, 
  CheckCircle, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/monitor/");
      setStats(res.data);
    } catch (err) {
      setError("Access denied or failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <div className="flex justify-center py-20 animate-pulse">Loading dashboard...</div>;
  if (error) return <p className="text-center text-red-600 font-medium mt-10">{error}</p>;

  const statCards = [
    { 
      title: "Total Users", 
      value: stats.total_users, 
      icon: Users, 
      color: "text-blue-600", 
      href: "/admin/users", // Assuming your path is /admin/users
      description: "Manage user roles and accounts"
    },
    { 
      title: "Total Tasks", 
      value: stats.total_tasks, 
      icon: LayoutList, 
      color: "text-purple-600", 
      href: "/admin/tasks", // Assuming your path is /admin/tasks
      description: "Monitor all system tasks"
    },
    { 
      title: "Completed Tasks", 
      value: stats.completed_tasks, 
      icon: CheckCircle, 
      color: "text-green-600", 
      href: "/admin/tasks",
      description: "View finished assignments"
    },
  ];

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Admin Console</h1>
          <p className="text-muted-foreground">Global system overview and statistics.</p>
        </div>
        <Link href="/me">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" /> My Profile
          </Button>
        </Link>
      </header>

      {/* Main Navigation Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((item, i) => (
          <Link href={item.href} key={i} className="block group">
            <Card className="transition-all duration-200 group-hover:ring-2 group-hover:ring-primary/50 group-hover:shadow-lg cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{item.value}</div>
                <p className="text-xs text-muted-foreground mb-4">{item.description}</p>
                <div className="flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Go to Management <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Health Card */}
        <Card className="border-t-4 border-t-green-500">
          <CardHeader className="flex flex-row items-center gap-4">
            <Activity className="h-6 w-6 text-green-500" />
            <div>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Backend operational status</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 py-1 px-3">
                <ShieldCheck className="h-4 w-4 mr-2" />
                {stats.status || "All systems operational"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* New Quick Shortcuts Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/admin/users">
              <Button size="sm" variant="secondary">View All Users</Button>
            </Link>
            <Link href="/admin/tasks">
              <Button size="sm" variant="secondary">Review Tasks</Button>
            </Link>
            <Link href="/tasks">
              <Button size="sm" variant="outline">Your Personal Tasks</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}