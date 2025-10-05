"use client";

import React, { useState,useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const data =
      typeof window !== "undefined" &&
      (localStorage.getItem("user-info") || sessionStorage.getItem("user-info"));
    if (data) {
      try {
        const u = JSON.parse(data as string);
        if (u && (u.id || u.email || u.name)) {
          router.replace("/home"); 
        }
      } catch {}
    }
  }, [router]);
  const API_URL = "http://localhost:4000/api/v1/auth/login"; 


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email.trim() || !password) {
    return;
  }
  setLoading(true);
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const contentType = res.headers.get("content-type") || "";
    let data: any;
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const txt = await res.text();
      try {
        data = txt ? JSON.parse(txt) : null;
      } catch {
        data = { message: txt };
      }
    }

    if (!res.ok) {
      console.error("Login failed:", data);
      return;
    }

    if (data.token) {
      const opts = (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
        ? "path=/; max-age=3600; SameSite=Lax"
        : "path=/; max-age=3600; Secure; SameSite=Lax";
      document.cookie = `token=${encodeURIComponent(data.token)}; ${opts}`;
    }

    if (data.user) {
      localStorage.setItem("user-info", JSON.stringify(data.user));
      window.dispatchEvent(new CustomEvent("user-changed", { detail: { user: data.user ?? data } }));

     
      switch (data.user.role) {
        case "Admin":
          router.replace("/admin");
          break;
        case "Author":
          router.replace("/author");
          break;
        
        default:
          router.replace("/home");
      }
    } else {
      router.replace("/home");
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};



  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f8fafc 60%, #f3e8ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "900px",
          maxWidth: "98vw",
          background: "rgba(255,255,255,0.7)",
          borderRadius: "28px",
          boxShadow: "0 4px 32px #0001",
          display: "flex",
          overflow: "hidden",
        }}
      >
       
        <div
          style={{
            flex: 1,
            padding: "48px 40px 40px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 340,
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 8 }}>Welcome back</h2>
          <div style={{ color: "#888", marginBottom: 28, fontSize: 16 }}>
            Continue with one of the following options
          </div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 10,
                  fontSize: 16,
                  background: "#fff",
                  outline: "none",
                  marginTop: 2,
                }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password 8-16 character"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 16,
                    background: "#fff",
                    outline: "none",
                    marginTop: 2,
                  }}
                />
                <span style={{ position: "absolute", right: 14, top: 13, color: "#bbb", cursor: "not-allowed" }}>
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 18, fontSize: 15 }}>
              <input type="checkbox" style={{ marginRight: 7 }} disabled />
              <span style={{ color: "#bbb" }}>Remember me</span>
              <div style={{ flex: 1 }} />
              <a href="#" style={{ color: "#222", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>Forgot Password?</a>
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#111",
                color: "#fff",
                fontWeight: 700,
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
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <button
              type="button"
              style={{
                width: "100%",
                background: "#fff",
                color: "#222",
                fontWeight: 600,
                fontSize: 17,
                border: "1.5px solid #e5e7eb",
                borderRadius: 10,
                padding: "11px 0",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 1px 4px #0001"
              }}
              onClick={() => alert("Google login chưa hỗ trợ!")}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 22, marginRight: 6 }} />
              Continue with Google
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: 18, color: "#888", fontSize: 15 }}>
            Already have an account? <a href="/register" style={{ color: "#111", fontWeight: 600 }}>Log In</a>
          </div>
        </div>
     
        <div
          style={{
            flex: 1.1,
            background: "rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderLeft: "1.5px solid #eee",
            minHeight: 480,
            minWidth: 320,
          }}
        >
          <img
            src="/logo1.jpg"
            alt="Astronaut"
            style={{ maxWidth: "90%", maxHeight: 380, objectFit: "contain", filter: "drop-shadow(0 8px 32px #0002)" }}
          />
        </div>
      </div>
    </main>
  );
}

