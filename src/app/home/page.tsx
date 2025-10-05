"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/api/v1/posts", { credentials: "include" });
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : data.posts || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ background: "#f6f7fb", minHeight: "100vh", padding: 0 }}>
      <div className="container" style={{ maxWidth: 600, margin: "0 auto", padding: "32px 0" }}>
        <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24, color: "#222" }}>Bảng tin</h2>
        {loading ? (
          <div className="text-center py-5">Đang tải bài viết...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-5 text-muted">Chưa có bài viết nào.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {posts.map(post => (
              <div key={post.id} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #0001", padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                  <img src={post.author?.avatarUrl || "/default-avatar.png"} alt={post.author?.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid #f3f3f3" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>{post.author?.name || post.author?.email || "Người dùng"}</div>
                    <div style={{ color: "#888", fontSize: 14 }}>{new Date(post.created_at || post.createdAt).toLocaleString()}</div>
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
                  Đăng lúc: {new Date(post.created_at || post.createdAt).toLocaleString()} | Cập nhật: {new Date(post.updated_at || post.updatedAt).toLocaleString()}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
