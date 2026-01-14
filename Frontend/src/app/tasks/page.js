"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Import Link for navigation
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Edit3, CheckCircle2, Circle, X, UserCircle } from "lucide-react"; // Added UserCircle icon

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "" });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks/");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!newTask.title) return setError("Title is required");
    try {
      const res = await api.post("/tasks/", newTask);
      setTasks([...tasks, res.data]);
      setNewTask({ title: "", description: "" });
      setError("");
    } catch (err) { setError("Failed to create task"); }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.task_id !== id));
    } catch { setError("Failed to delete task"); }
  };

  const toggleStatus = async (task) => {
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      const res = await api.patch(`/tasks/${task.task_id}`, { status: newStatus });
      setTasks(tasks.map((t) => (t.task_id === task.task_id ? res.data : t)));
    } catch { setError("Failed to update status"); }
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.patch(`/tasks/${id}`, editData);
      setTasks(tasks.map((t) => (t.task_id === id ? res.data : t)));
      setEditingTaskId(null);
    } catch { setError("Failed to update task"); }
  };

  const filteredTasks = tasks.filter(t => filter === "all" || t.status === filter);

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 space-y-8">
      {/* Updated Header with Profile Button */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-6">
        <div className="flex justify-between items-center w-full md:w-auto gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Task Manager</h1>
            <p className="text-muted-foreground">Organize your workflow efficiently.</p>
          </div>
          {/* Mobile Profile Icon (Visible only on small screens) */}
          <Link href="/me" className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="h-8 w-8 text-primary" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Tabs value={filter} onValueChange={setFilter} className="flex-1 md:w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Desktop Profile Button (Visible only on medium+ screens) */}
          <Link href="/me" className="hidden md:block">
            <Button variant="outline" className="gap-2 shadow-sm hover:bg-primary hover:text-primary-foreground transition-all">
              <UserCircle className="h-5 w-5" />
              Profile
            </Button>
          </Link>
        </div>
      </header>

      {error && (
        <Badge variant="destructive" className="w-full py-2 justify-center text-sm">
          {error} <X className="ml-2 h-4 w-4 cursor-pointer" onClick={() => setError("")} />
        </Badge>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" /> New Task
              </CardTitle>
              <CardDescription>Add a task to your list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Add details..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="resize-none"
                />
              </div>
              <Button className="w-full" onClick={handleCreateTask}>Create Task</Button>
            </CardContent>
          </Card>
        </div>

        {/* Task List Section */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center py-20 text-muted-foreground animate-pulse">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-xl text-muted-foreground">
              No {filter !== "all" ? filter : ""} tasks found.
            </div>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.task_id} className="transition-all hover:shadow-md">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      {editingTaskId === task.task_id ? (
                        <div className="space-y-3">
                          <Input
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          />
                          <Textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveEdit(task.task_id)}>Save Changes</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingTaskId(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <h3 className={`text-xl font-semibold leading-none ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </h3>
                            <Badge variant={task.status === "completed" ? "secondary" : "default"}>
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-2">{task.description || "No description provided."}</p>
                        </>
                      )}
                    </div>

                    {editingTaskId !== task.task_id && (
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingTaskId(task.task_id);
                            setEditData({ title: task.title, description: task.description || "" });
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteTask(task.task_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {editingTaskId !== task.task_id && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex justify-end">
                        <Button 
                          variant={task.status === "completed" ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleStatus(task)}
                          className="gap-2"
                        >
                          {task.status === "completed" ? (
                            <><Circle className="h-4 w-4" /> Mark Pending</>
                          ) : (
                            <><CheckCircle2 className="h-4 w-4" /> Mark Completed</>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}