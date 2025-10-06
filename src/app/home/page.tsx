"use client";

import React, { useEffect, useState } from "react";
import CategorySidebar from "@/components/CategorySidebar";
import { FixedSizeList as List } from "react-window";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [likeCounts, setLikeCounts] = useState<{ [postId: string]: number }>({});
  const [liked, setLiked] = useState<{ [postId: string]: boolean }>({});
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/v1/posts", { credentials: "include" });
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : data.posts || []);
        
        const likeObj: any = {};
        const likedObj: any = {};
        (Array.isArray(data) ? data : data.posts || []).forEach((p: any) => {
          likeObj[p.id] = p.likeCount || 0;
          likedObj[p.id] = false;
        });
        setLikeCounts(likeObj);
        setLiked(likedObj);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  
  const handleLike = (postId: string) => {
    setLiked(prev => ({ ...prev, [postId]: !prev[postId] }));
    setLikeCounts(prev => ({ ...prev, [postId]: prev[postId] + (liked[postId] ? -1 : 1) }));
  };

  
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(() => {
      const lower = search.toLowerCase();
      setSuggestions(posts.filter(p => p.title?.toLowerCase().includes(lower) || p.content?.toLowerCase().includes(lower)).slice(0, 5));
      setShowSuggestions(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [search, posts]);

  const filteredPosts = selectedCategory === "all"
    ? posts
    : posts.filter(post => post.category_id === selectedCategory);

  return (
    <div style={{ background: "#f6f7fb", minHeight: "100vh", padding: 0 }}>
      <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 0", display: "flex", gap: 32 }}>
        <CategorySidebar onSelect={setSelectedCategory} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24, color: "#222" }}>Bảng tin</h2>
          
          <div style={{ position: "relative", marginBottom: 24 }}>
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: 400, borderRadius: 8, fontSize: 17, padding: "10px 16px" }}
              placeholder="Tìm kiếm bài viết..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul style={{ position: "absolute", top: 44, left: 0, width: 400, background: "#fff", border: "1px solid #eee", borderRadius: 8, boxShadow: "0 2px 8px #0001", zIndex: 10, listStyle: "none", margin: 0, padding: 0 }}>
                {suggestions.map(s => (
                  <li key={s.id} style={{ padding: "10px 16px", cursor: "pointer" }} onMouseDown={() => { setSearch(s.title); setShowSuggestions(false); }}>
                    <b>{s.title}</b>
                    <div style={{ color: "#888", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.content?.slice(0, 60)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {loading ? (
            <div className="text-center py-5">Đang tải bài viết...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-5 text-muted">Chưa có bài viết nào.</div>
          ) : (
            <List
              height={700}
              itemCount={filteredPosts.length}
              itemSize={320}
              width={"100%"}
              style={{ borderRadius: 12, background: "none" }}
            >
              {({ index, style }: { index: number; style: React.CSSProperties }) => {
                const post = filteredPosts[index];
                return (
                  <div key={post.id} style={{ ...style, paddingBottom: 18 }}>
                    <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #0001", padding: 20 }}>
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
                        <button
                          className={`btn btn-light btn-sm${liked[post.id] ? " btn-primary" : ""}`}
                          style={{ fontWeight: 600, color: liked[post.id] ? "#fff" : "#222", border: "1px solid #eee", borderRadius: 8 }}
                          onClick={() => handleLike(post.id)}
                        >
                          {liked[post.id] ? "Unlike" : "Like"} ({likeCounts[post.id] || 0})
                        </button>
                        <button className="btn btn-light btn-sm" style={{ fontWeight: 600, color: "#222", border: "1px solid #eee", borderRadius: 8 }}>
                          Comment
                        </button>
                        <button className="btn btn-light btn-sm" style={{ fontWeight: 600, color: "#222", border: "1px solid #eee", borderRadius: 8 }}>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }}
            </List>
          )}
        </div>
      </div>
    </div>
  );
}
