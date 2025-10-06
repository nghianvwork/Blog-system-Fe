"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id?: number;
  email?: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

 
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/v1/users/profile", {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          if (res.status === 401) {
            
            router.push("/login");
            return;
          }
          const text = await res.text();
          alert("Lỗi khi lấy profile: " + text);
          return;
        }

        const json = await res.json();
        setUser(json.user || null);

        
        setName(json.user?.name || "");
        setBio(json.user?.bio || "");
        setAvatarUrl(json.user?.avatarUrl || "");
      } catch (err) {
        console.error(err);
        alert("Có lỗi khi gọi API profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: any = { name, bio, avatarUrl };

      if (oldPassword || newPassword) {
        if (!oldPassword || !newPassword) {
          alert("Cần nhập cả mật khẩu cũ và mật khẩu mới để đổi mật khẩu");
          setSaving(false);
          return;
        }
        if (newPassword.length < 6) {
          alert("Mật khẩu mới cần ít nhất 6 ký tự");
          setSaving(false);
          return;
        }
        payload.oldPassword = oldPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch("http://localhost:3000/api/v1/users/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

     
      const text = await res.text();
      let body: any = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = { message: text };
      }

      if (!res.ok) {
        alert(body?.message || `Cập nhật thất bại (status ${res.status})`);
        return;
      }

     
      setUser(body.user);
      setOldPassword("");
      setNewPassword("");
     
      try {
        if (body.user) localStorage.setItem("user-info", JSON.stringify(body.user));
      } catch {}
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi lưu profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container py-5">Đang tải...</div>;
  }

  return (
    <main className="container py-5" style={{ maxWidth: 900 }}>
      <h2 className="mb-4">Hồ sơ của tôi</h2>

      <div className="card mb-4">
        <div className="card-body d-flex gap-4">
          <img
            src={avatarUrl}
            alt="avatar"
            style={{ width: 96, height: 96, objectFit: "cover", borderRadius: "8px" }}
          />
          <div>
            <h5 className="mb-1">{user?.name || user?.email}</h5>
            <p className="mb-1 text-muted">{user?.email}</p>
            <p>{user?.bio}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label">Tên hiển thị</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea className="form-control" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Avatar URL</label>
          <input className="form-control" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
          <small className="text-muted">Hoặc upload file lên storage và dán URL vào đây.</small>
        </div>

        <hr />

        <h6>Đổi mật khẩu</h6>
        <div className="mb-3">
          <label className="form-label">Mật khẩu cũ</label>
          <input type="password" className="form-control" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu mới</label>
          <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit"  style={{
                width: "150px",
                background: "#111",
                color: "#fff",
                fontWeight: 100,
                fontSize: 18,
                border: 0,
                borderRadius: 10,
                padding: "12px 0",
                marginBottom: 12,
                boxShadow: "0 2px 8px #0001",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all .2s"
              }}disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </main>
  );
}
