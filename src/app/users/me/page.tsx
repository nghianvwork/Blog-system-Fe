"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
type User = {
  id?: number;
  email?: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  category_id?: string;
  author?: User;
};

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<Post[]>([]);

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
          return;
        }
        const json = await res.json();
        setUser(json.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/posts?userId=${user.id}`, { credentials: "include" });
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : data.posts || []);
      } catch {
        setPosts([]);
      }
    };
    fetchPosts();
  }, [user?.id]);

  if (loading) {
    return <div className="container py-5">Đang tải...</div>;
  }

  return (
    <div style={{ background: "#f6f7fb", minHeight: "100vh", padding: 0 }} className="container">
      <div style={{ background: "#fff", height: 220, borderRadius: 0, position: "relative", marginBottom: 0 }}>
   
        <div style={{ background: "linear-gradient(90deg,#e0e7ff,#f3f4f6)", height: 160, borderRadius: 0 }} />
        <div style={{ position: "absolute", left: 40, top: 100, display: "flex", alignItems: "center", gap: 24 }}>
          <img src={user?.avatarUrl || "/default-avatar.png"} alt={user?.name} style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "4px solid #fff", boxShadow: "0 2px 12px #0002" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 28 }}>{user?.name || user?.email}</div>
            <div style={{ color: "#888", fontSize: 17 }}>{user?.email}</div>
            <div style={{ color: "#666", fontSize: 16 }}>{user?.bio}</div>
          </div>
        </div>
      </div>
      <div className="container" style={{ maxWidth: 800, margin: "0 auto", marginTop: 60 }}>
        <div style={{ display: "flex", gap: 32, borderBottom: "1px solid #eee", marginBottom: 32 }}>
          <button className={`btn btn-link px-0 ${activeTab === "posts" ? "fw-bold text-primary" : "text-dark"}`} style={{ fontSize: 20, textDecoration: "none" }} onClick={() => setActiveTab("posts")}>Bài viết</button>
          <button className={`btn btn-link px-0 ${activeTab === "friends" ? "fw-bold text-primary" : "text-dark"}`} style={{ fontSize: 20, textDecoration: "none" }} onClick={() => setActiveTab("friends")}>Bạn bè</button>
          <button className={`btn btn-link px-0 ${activeTab === "following" ? "fw-bold text-primary" : "text-dark"}`} style={{ fontSize: 20,textDecoration: "none" }} onClick={() => setActiveTab("following")}>Đang theo dõi</button>
          <button className={`btn btn-link px-0 ${activeTab === "followers" ? "fw-bold text-primary" : "text-dark"}`} style={{ fontSize: 20, textDecoration: "none" }} onClick={() => setActiveTab("followers")}>Người theo dõi</button>
        </div>
        {activeTab === "posts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {posts.length === 0 ? (
              <div className="text-center py-5 text-muted">Chưa có bài viết nào.</div>
            ) : (
              posts.map(post => (
                <div key={post.id} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #0001", padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                    <img src={user?.avatarUrl || "/default-avatar.png"} alt={user?.name} width={48} height={48} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #f3f3f3" }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 17 }}>{user?.name || user?.email || "Người dùng"}</div>
                      <div style={{ color: "#888", fontSize: 14 }}>{post.created_at ? new Date(post.created_at).toLocaleString() : ""}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{post.title}</div>
                  {post.excerpt && <div style={{ color: "#666", fontSize: 15, marginBottom: 6 }}>{post.excerpt}</div>}
                  {post.imageUrl && (
                    <div style={{ margin: "12px 0" }}>
                      <img src={post.imageUrl} alt="post-img" style={{ width: "100%", borderRadius: 10, maxHeight: 400, objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ fontSize: 17, marginBottom: 8, whiteSpace: "pre-line" }}>{post.content}</div>
                  <div style={{ color: "#888", fontSize: 14, marginBottom: 4 }}>
                    <span>Trạng thái: <b>{post.status}</b></span>
                    {post.category_id && <span style={{ marginLeft: 12 }}>Chuyên mục: <b>{post.category_id}</b></span>}
                  </div>
                  <div style={{ color: "#bbb", fontSize: 13, marginBottom: 2 }}>
                    Đăng lúc: {post.created_at ? new Date(post.created_at).toLocaleString() : ""} | Cập nhật: {post.updated_at ? new Date(post.updated_at).toLocaleString() : ""}
                  </div>
                  <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
                    <button className="btn btn-light btn-sm" style={{ fontWeight: 600, color: "#222", border: "1px solid #eee", borderRadius: 8 }}>
                      Like
                    </button>
                    <button className="btn btn-light btn-sm" style={{ fontWeight: 600, color: "#222", border: "1px solid #eee", borderRadius: 8 }}>
                      Comment
                    </button>
                    <button className="btn btn-light btn-sm" style={{ fontWeight: 600, color: "#222", border: "1px solid #eee", borderRadius: 8 }}>
                      Share
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === "friends" && (
          <div className="text-center py-5 text-muted">Tính năng bạn bè đang phát triển.</div>
        )}
        {activeTab === "following" && (
          <div className="text-center py-5 text-muted">Tính năng theo dõi đang phát triển.</div>
        )}
        {activeTab === "followers" && (
          <div className="text-center py-5 text-muted">Tính năng người theo dõi đang phát triển.</div>
        )}
      </div>
    </div>
  );
}
