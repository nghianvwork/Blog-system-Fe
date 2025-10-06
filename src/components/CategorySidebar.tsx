import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function CategorySidebar({ onSelect }: { onSelect?: (cat: string) => void }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    // Giả lập fetch category, bạn có thể thay bằng API thực tế
    async function fetchCategories() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/v1/categories");
        const data = await res.json();
        setCategories(data);
        // setCategories([
        //   { id: "all", name: "Tất cả" },
        //   { id: "tech", name: "Công nghệ" },
        //   { id: "life", name: "Đời sống" },
        //   { id: "edu", name: "Giáo dục" },
        //   { id: "news", name: "Tin tức" },
        // ]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <aside style={{ width: 210, background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #0001", padding: 24, marginRight: 32, minHeight: 300 }}>
      <h4 style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Chuyên mục</h4>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {categories.map(cat => (
            <li key={cat.id}>
              <button
                onClick={() => { setActive(cat.id); onSelect && onSelect(cat.id); }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: active === cat.id ? "#e0e7ff" : "#fff",
                  color: active === cat.id ? "#1d4ed8" : "#222",
                  border: 0,
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 6,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "all .15s"
                }}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
