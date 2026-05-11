"use client"
import { useEffect, useState } from "react"
import { SkeletonNewsCard } from "./Skeleton"

type Article = {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: { name: string }
  author: string
}

const API_KEY = process.env.NEXT_PUBLIC_NEWSAPI_KEY || ""

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("crypto")

  const categories = [
    { id: "crypto", label: "Crypto", query: "cryptocurrency bitcoin ethereum" },
    { id: "web3", label: "Web3", query: "web3 blockchain defi nft" },
    { id: "stocks", label: "Stocks", query: "stocks market nasdaq wall street" },
    { id: "ai", label: "AI & Tech", query: "artificial intelligence technology startups" },
  ]

  useEffect(() => {
    setLoading(true)
    setError("")
    const active = categories.find(c => c.id === category)
    fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(active?.query || "crypto")}&sortBy=publishedAt&pageSize=40&language=en&apiKey=${API_KEY}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (data.status === "error") throw new Error(data.message)
        const valid = (data.articles || []).filter((a: Article) =>
          a.title && a.title !== "[Removed]" && a.description && a.description !== "[Removed]"
        )
        setArticles(valid)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [category])

  const filtered = articles.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.description?.toLowerCase().includes(search.toLowerCase())
  )

  const timeAgo = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div>
      {/* Controls */}
      <div className="controls-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        {/* Category Tabs */}
        <div style={{ display: "flex", gap: 6, background: "#111122", borderRadius: 10, padding: 4 }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              style={{
                background: category === c.id ? "#3b82f6" : "transparent",
                border: "none",
                borderRadius: 7,
                padding: "6px 14px",
                color: category === c.id ? "#fff" : "#666",
                fontSize: 12,
                fontWeight: category === c.id ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={e => setSearch(e.target.value)}
         className="search-input" style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 10, padding: "7px 13px", color: "#fff", fontSize: 13, outline: "none", width: 200 }}
        />
      </div>

      {loading ? (
       <div className="grid-news" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {[...Array(12)].map((_, i) => <SkeletonNewsCard key={i} />)}
        </div>
      ) : error ? (

        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <p style={{ color: "#f87171" }}>Error: {error}</p>
          <button
            onClick={() => setCategory(category)}
            style={{ marginTop: 12, background: "#3b82f6", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", fontSize: 13 }}
          >Retry</button>
        </div>
      ) : (
        <>
          <p style={{ color: "#555", fontSize: 13, marginBottom: 14 }}>{filtered.length} articles found</p>
          <div className="grid-news" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {filtered.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{ background: "#111122", border: "1px solid #1e1e3a", borderRadius: 12, overflow: "hidden", height: "100%", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#3b82f6")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e1e3a")}
                >
                  {/* Image */}
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      style={{ width: "100%", height: 140, objectFit: "cover" }}
                      onError={e => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div style={{ width: "100%", height: 140, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>📰</div>
                  )}

                  {/* Content */}
                  <div style={{ padding: "12px 14px" }}>
                    {/* Source & Time */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 6, padding: "2px 8px", fontSize: 10, color: "#60a5fa", fontWeight: 600 }}>
                        {article.source.name}
                      </span>
                      <span style={{ fontSize: 10, color: "#555" }}>{timeAgo(article.publishedAt)}</span>
                    </div>

                    {/* Title */}
                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {article.title}
                    </p>

                    {/* Description */}
                    <p style={{ margin: 0, fontSize: 11, color: "#666", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {article.description}
                    </p>

                    {/* Read more */}
                    <p style={{ margin: "10px 0 0", fontSize: 11, color: "#3b82f6" }}>Read full article ↗</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  )
}