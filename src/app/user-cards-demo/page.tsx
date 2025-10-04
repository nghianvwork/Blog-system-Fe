"use client";
import React, { useEffect, useState } from "react";
import AdminUserCard from "@/app/user-cards-demo/components/AdminUserCard";
import AuthorUserCard from "@/app/user-cards-demo/components/AuthorUserCard";


type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Author" | "Reader";
};

export default function UserCardsDemoPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/v1/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleViewPosts = (role: string) => () => alert(`Viewing posts for ${role}`);
  const handleEdit = (role: string) => () => alert(`Editing ${role}`);
  const handleDelete = (role: string) => () => alert(`Deleting ${role}`);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h1>User Card Demo</h1>
      {users.map((user) => {
        const cardProps = {
          name: user.name,
          email: user.email,
          role: user.role,
          onViewPosts: handleViewPosts(user.role),
          onEdit: handleEdit(user.role),
          onDelete: handleDelete(user.role),
        };
        if (user.role === "Admin") return <AdminUserCard key={user.id} {...cardProps} />;
        if (user.role === "Author") return <AuthorUserCard key={user.id} {...cardProps} />;
        return null;
      })}
    </div>
  );
}