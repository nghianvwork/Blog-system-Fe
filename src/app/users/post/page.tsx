"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
export default function UserPostsPage() {
		const searchParams = useSearchParams();
		const userId = searchParams ? searchParams.get("id") : null;
	const [user, setUser] = useState<any>(null);
	const [posts, setPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!userId) return;
		const fetchData = async () => {
			setLoading(true);
			try {
				const [userRes, postsRes] = await Promise.all([
					fetch(`http://localhost:3000/api/v1/users/${userId}`, { credentials: "include" }),
					fetch(`http://localhost:3000/api/v1/posts?userId=${userId}`, { credentials: "include" })
				]);
				const userData = await userRes.json();
				const postsData = await postsRes.json();
				setUser(userData.user || userData);
				setPosts(Array.isArray(postsData) ? postsData : postsData.posts || []);
			} catch {
				setUser(null);
				setPosts([]);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [userId]);

	if (!userId) return <div className="container py-5">Không tìm thấy user.</div>;

		return (
			<div style={{ background: "#f6f7fb", minHeight: "100vh", padding: 0 }}>
				<div className="container" style={{ maxWidth: 700, margin: "0 auto", padding: "32px 0" }}>
					{user && (
						<div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}>
							<Image src={user.avatarUrl || "/default-avatar.png"} alt={user.name} width={80} height={80} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #eee" }} />
							<div>
								<div style={{ fontWeight: 700, fontSize: 26 }}>{user.name}</div>
								<div style={{ color: "#888", fontSize: 16 }}>{user.email}</div>
								<div style={{ color: "#666", fontSize: 15 }}>{user.bio}</div>
							</div>
						</div>
					)}
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
						<h3 style={{ fontWeight: 700, fontSize: 22, margin: 0 }}>Bài viết</h3>
						<a href="/posts/create" className="btn btn-primary" style={{ fontWeight: 600, borderRadius: 8, padding: "8px 20px" }}>
							<i className="bi bi-plus-lg"></i> Tạo bài viết
						</a>
					</div>
				{loading ? (
					<div className="text-center py-5">Đang tải bài viết...</div>
				) : posts.length === 0 ? (
					<div className="text-center py-5 text-muted">Chưa có bài viết nào.</div>
				) : (
					<div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
														{posts.map(post => {
															return (
																<div key={post.id} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #0001", padding: 20 }}>
																	<div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
																		<Image src={user?.avatarUrl || "/default-avatar.png"} alt={user?.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #f3f3f3" }} />
																		<div>
																			<div style={{ fontWeight: 600, fontSize: 17 }}>{user?.name || user?.email || "Người dùng"}</div>
																			<div style={{ color: "#888", fontSize: 14 }}>{new Date(post.created_at || post.createdAt).toLocaleString()}</div>
																		</div>
																	</div>
																	<div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{post.title}</div>
																	{post.excerpt && <div style={{ color: "#666", fontSize: 15, marginBottom: 6 }}>{post.excerpt}</div>}
																	{post.imageUrl && (
																		<div style={{ margin: "12px 0" }}>
																			<Image src={post.imageUrl} alt="post-img" style={{ width: "100%", borderRadius: 10, maxHeight: 400, objectFit: "cover" }} />
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
															);
														})}
					</div>
				)}
			</div>
		</div>
	)
}
