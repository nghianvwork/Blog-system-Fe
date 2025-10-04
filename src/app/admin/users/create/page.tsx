'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function CreateUserPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const createUser = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) throw new Error("Failed to create user");
        router.push("/admin/users");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    createUser();
  };

  return (
    <div className="container" style={{ maxWidth: 480, marginTop: 48 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="mb-4 text-center fw-bold">Tạo người dùng mới</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Tên</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={loading}
              >
                {loading ? "Đang tạo..." : "Tạo người dùng"}
              </button>
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => router.push("/admin/users")}
                disabled={loading}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateUserPage;