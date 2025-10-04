"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import "bootstrap/dist/css/bootstrap.min.css";


export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = () => {
      const data = localStorage.getItem("user-info") || sessionStorage.getItem("user-info");
      try {
        setUser(data ? JSON.parse(data) : null);
      } catch (err) {
        console.error("parse user-info failed", err);
        setUser(null);
      }
    };
    loadUser();
    const onStorage = (e: StorageEvent) => loadUser();
    const onUserChanged = (e: Event) => loadUser();
    window.addEventListener("storage", onStorage);
    window.addEventListener("user-changed", onUserChanged as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("user-changed", onUserChanged as EventListener);
    };
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user-info");
    sessionStorage.removeItem("user-info");
    setUser(null);
    window.location.href = "/login";
  };
 
  return (
    <header style={{ background: "#fff", borderBottom: "2px solid #e6f3fa", padding: 0 }}>
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 32px",
        height: 68,
        gap: 24,
      }}>
        <div  style={{ display: "flex", alignItems: "center", gap: 10 }} >
          <img src="/lo.jpg" alt="logo" style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 8 }} />
          <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 0.5, color: "#111" }}><Link href="/" style={{ textDecoration: "none", color: "#111" }}>Blog system</Link></span>
        </div>
    
        {user && (
          <ul style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}>
            <li><Link href="/" style={{ color: "#222", fontWeight: 500, textDecoration: "none" }}>Home</Link></li>
            <li  style={{ position: "relative" }}>
              <Link  href="/users/profile" style={{ color: "#222", fontWeight: 500, cursor: "pointer",textDecoration: "none" }} >Hồ sơ cá nhân <span style={{ fontSize: 14 }}>▼</span></Link>
            </li>
            <li style={{ position: "relative" }}>
              <span style={{ color: "#222", fontWeight: 500, cursor: "pointer" }}>Post <span style={{ fontSize: 14 }}>▼</span></span>
            </li>
          </ul>
        )}
       
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search..."
              style={{
                background: "#faf8fa",
                border: 0,
                borderRadius: 18,
                padding: "8px 38px 8px 18px",
                fontSize: 16,
                minWidth: 160,
                outline: "none",
                color: "#222",
                boxShadow: "0 1px 4px #0001"
              }}
            />
            <span style={{ position: "absolute", right: 12, top: 8, color: "#bbb" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
          </div>
          
         
          {user ? (
            <div style={{ position: "relative" }}>
              <img
                src={user?.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                style={{ width: 38, height: 38, objectFit: "cover", borderRadius: "50%", border: "2px solid #eee", cursor: "pointer" }}
                title={user.name}
              />
            
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/login" style={{ color: "#222", fontWeight: 500, textDecoration: "none" }}>Đăng nhập</Link>
              <Link href="/register" style={{ color: "#222", fontWeight: 500, textDecoration: "none" }}>Đăng ký</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
