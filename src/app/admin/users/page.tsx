'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
type User = {
  id?: number;
  email?: string;
  name?: string;
  bio?: string;
  avatar?: string;
  role?: string;
  banned?: boolean;
};

function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

 
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/v1/admin/users", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 
  const handleDelete = async (userId?: number) => {
    if (!userId) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      await fetchUsers();
    } catch (err) {
      alert("Lỗi khi xóa người dùng");
    }
  };

 
  const handleBan = async (userId?: number) => {
    if (!userId) return;
    if (!window.confirm("Ban người dùng này?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/users/${userId}/ban`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ban thất bại");
      await fetchUsers();
    } catch (err) {
      alert("Lỗi khi ban người dùng");
    }
  };


  const handleUnban = async (userId?: number) => {
    if (!userId) return;
    if (!window.confirm("Unban người dùng này?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/users/${userId}/unban`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Unban thất bại");
      await fetchUsers();
    } catch (err) {
      alert("Lỗi khi unban người dùng");
    }
  };

  const handleAddUser = () => {
    router.push("/admin/users/create");
  };

 
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? (user.role === roleFilter) : true;
    return matchSearch && matchRole;
  });

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: "60vh"}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: 900, marginTop: 40 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Quản lý người dùng</h1>
        <button className="btn btn-success shadow" onClick={handleAddUser}>
          <i className="bi bi-person-plus"></i> Thêm người dùng
        </button>
      </div>
      
      <div className="d-flex align-items-center mb-3" style={{gap: 16}}>
        <input
          type="text"
          className="form-control"
          style={{maxWidth: 260}}
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          style={{maxWidth: 180}}
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="Admin">Admin</option>
          <option value="Author">Author</option>
          <option value="User">User</option>
        </select>
      </div>
      <div className="table-responsive shadow rounded bg-white">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{width: 60}}>ID</th>
              <th style={{minWidth: 140}}>Tên</th>
              <th>Email</th>
              <th>Bio</th>
              <th>Avatar</th>
              <th style={{width: 140}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: User) => (
              <tr key={user.id}>
                <td className="fw-semibold">{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td style={{maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{user.bio}</td>
                <td>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid #eee" }}
                    />
                  ) : (
                    <span className="text-muted fst-italic">No Avatar</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm me-2 shadow-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    <i className="bi bi-trash"></i> Xóa
                  </button>
                  {user.banned ? (
                    <button
                      className="btn btn-success btn-sm shadow-sm"
                      onClick={() => handleUnban(user.id)}
                    >
                      <i className="bi bi-check-circle"></i> Unban
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning btn-sm shadow-sm"
                      onClick={() => handleBan(user.id)}
                    >
                      <i className="bi bi-slash-circle"></i> Ban
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsersPage;