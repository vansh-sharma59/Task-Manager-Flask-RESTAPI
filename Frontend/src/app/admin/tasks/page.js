"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, User, RefreshCcw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      const res = await api.get("/admin/tasks/");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks. Admin privileges required.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const toggleStatus = async (task) => {
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      const res = await api.put(`/admin/tasks/${task.task_id}`, { ...task, status: newStatus });
      setTasks(tasks.map(t => t.task_id === task.task_id ? res.data : t));
    } catch (err) { setError("Update failed."); }
  };

  const deleteTask = async (task_id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/admin/tasks/${task_id}`);
      setTasks(tasks.filter(t => t.task_id !== task_id));
    } catch (err) { setError("Delete failed."); }
  };

  const filteredTasks = tasks.filter(t => filter === "all" || t.status === filter);

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Manage All Tasks</h1>
          <p className="text-muted-foreground">Total tasks across all users: {tasks.length}</p>
        </div>
        <Tabs value={filter} onValueChange={setFilter} className="w-[300px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Done</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : filteredTasks.map(task => (
          <Card key={task.task_id} className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xl">{task.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase">
                    <User className="h-3 w-3 mr-1" /> User: {task.user_id}
                  </Badge>
                  <Badge variant={task.status === "completed" ? "secondary" : "default"}>
                    {task.status}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteTask(task.task_id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{task.description || "No description provided."}</p>
            </CardContent>
            <CardFooter border-t>
              <Button variant="outline" size="sm" className="w-full" onClick={() => toggleStatus(task)}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Set to {task.status === "completed" ? "Pending" : "Completed"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}