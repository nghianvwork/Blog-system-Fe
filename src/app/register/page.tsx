"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
  const router = useRouter();

  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState(["Admin", "Author", "User"][2]);
  const [loading, setLoading] = useState(false);

  
  const API_URL =
  (process.env.NEXT_PUBLIC_API_URL
    
    = "http://localhost:3000") + "/api/v1/auth/register";


  const validateForm = () => {
    if (!name.trim()) return "Username không được để trống";
    if (!email.trim()) return "Email không được để trống";
  
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return "Email không hợp lệ";
    if (password.length < 6) return "Mật khẩu cần ít nhất 6 ký tự";
    return null;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      alert(err);
      return;
    }

    setLoading(true);

    try {
      const userPayload = {
        name: name.trim(),
        password, 
        email: email.trim(),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      
      const text = await response.text();
      let body: any = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = { message: text };
      }

      if (!response.ok) {
       
        alert(body?.message || `Đăng ký thất bại (status ${response.status})`);
        return;
      }

      
      if (body?.user) {
        
        localStorage.setItem("user-info", JSON.stringify(body.user));
      } else if (body) {
        
        localStorage.setItem("user-info", JSON.stringify(body));
      }

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau."+ err);
    } finally {
      setLoading(false);
     
    }
  };

  return (
    <main className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: "80vh" }}>
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: 720 }}>
        <div className="card-body">
          <h2 className="card-title mb-4">Đăng ký tài khoản</h2>

          <form onSubmit={handleRegister}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Username</label>
<input
                  type="text"
                  className="form-control"
                  placeholder="Nhập username"
                  value={name}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Avatar URL</label>
              <input
                type="file"
                className="form-control"
                placeholder="Nhập Avatar URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Bio</label>
              <textarea
                className="form-control"
                placeholder="Nhập Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Author">Author</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                <small className="text-muted">
                  Bằng việc tạo tài khoản bạn đồng ý với điều khoản dịch vụ.
                </small>
              </div>

              <div>
                <button  type="submit"
              style={{
                width: "220px",
                background: "#111",
                color: "#fff",
                fontWeight: 1000,
                fontSize: 18,
                border: 0,
                borderRadius: 10,
                padding: "12px 0",
                marginBottom: 12,
                boxShadow: "0 2px 8px #0001",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all .2s"
              }}
              disabled={loading}>
                  {loading ? "Đang đăng ký..." : "Register"}
                </button>
              </div>
            </div>
          </form>

          <hr />

          <p className="mb-0">
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </p>
        </div>
      </div>
    </main>
  );
}