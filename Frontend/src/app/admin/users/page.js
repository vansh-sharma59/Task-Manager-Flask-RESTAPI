"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, UserMinus, UserPlus, Mail, Calendar } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users/");
      setUsers(res.data);
    } catch (err) {
      setError("Admin access required.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const promoteUser = async (id) => {
    try {
      await api.patch(`/admin/users/${id}`, { role: "admin" });
      setUsers(users.map(u => u.id === id ? { ...u, role: "admin" } : u));
    } catch (err) { setError("Promotion failed."); }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete user permanently? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) { setError("Delete failed."); }
  };

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage roles and account access.</p>
      </header>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : users.map(user => (
          <Card key={user.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {(user.username || user.email)[0].toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold leading-none">{user.username || "User"}</p>
                    <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-3">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {user.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto md:ml-0">
                {user.role !== "admin" && (
                  <Button variant="outline" size="sm" onClick={() => promoteUser(user.id)}>
                    <UserPlus className="h-4 w-4 mr-2" /> Promote
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => deleteUser(user.id)}>
                  <UserMinus className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}