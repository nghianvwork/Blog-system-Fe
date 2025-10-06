"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("public");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/v1/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, imageUrl, category_id: category, status }),
      });
      if (!res.ok) {
        const text = await res.text();
        alert("Tạo bài viết thất bại: " + text);
        setLoading(false);
        return;
      }
      alert("Tạo bài viết thành công!");
      router.push("/users/post");
    } catch (err) {
      alert("Có lỗi khi tạo bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #0001", padding: 32 }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Tạo bài viết mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tiêu đề</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required maxLength={200} />
        </div>
        <div className="mb-3">
          <label className="form-label">Nội dung</label>
          <textarea className="form-control" rows={7} value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Ảnh (URL)</label>
          <input className="form-control" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="mb-3">
          <label className="form-label">Chuyên mục</label>
          <input className="form-control" value={category} onChange={e => setCategory(e.target.value)} placeholder="Nhập tên hoặc ID chuyên mục" />
        </div>
        <div className="mb-3">
          <label className="form-label">Trạng thái</label>
          <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="public">Công khai</option>
            <option value="private">Riêng tư</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary" style={{ minWidth: 140 }} disabled={loading}>
            {loading ? "Đang đăng..." : "Đăng bài"}
          </button>
        </div>
      </form>
    </div>
  );
}
