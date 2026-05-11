"use client"
import { useEffect, useState } from "react"
import { SkeletonExchangeCard } from "./Skeleton"

type Exchange = {
  id: string
  name: string
  image: string
  trust_score: number
  trust_score_rank: number
  trade_volume_24h_btc: number
  url: string
  country: string
  year_established: number
}

export default function ExchangePage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/exchanges?per_page=50&page=1")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setExchanges(data)
        } else {
          setError("Unexpected response from API")
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filtered = exchanges.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase())
  )

  const trustColor = (score: number) => {
    if (score >= 8) return "#4ade80"
    if (score >= 5) return "#facc15"
    return "#f87171"
  }

 if (loading) return (
   <div className="grid-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
      {[...Array(20)].map((_, i) => <SkeletonExchangeCard key={i} />)}
    </div>
  )
  if (error) return <p style={{ color: "#f87171", textAlign: "center", padding: "3rem 0" }}>Error: {error} — CoinGecko may be rate limiting. Wait 60s and switch tabs.</p>

  return (
    <div>
    <div className="controls-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <p style={{ color: "#555", margin: 0, fontSize: 13 }}>Top {filtered.length} exchanges by trust score</p>
        <input
          type="text"
          placeholder="Search exchanges..."
          value={search}
          onChange={e => setSearch(e.target.value)}
         className="search-input" style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 10, padding: "7px 13px", color: "#fff", fontSize: 13, outline: "none", width: 200 }}
        />
      </div>

     <div className="grid-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
        {filtered.map((ex, i) => (
          <a
            key={ex.id}
            href={ex.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{ background: "#111122", border: "1px solid #1e1e3a", borderRadius: 12, padding: "14px", transition: "border-color 0.2s", height: "100%", boxSizing: "border-box" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#3b82f6")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e1e3a")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ color: "#444", fontSize: 11, minWidth: 20 }}>#{i + 1}</span>
                {ex.image
                  ? <img src={ex.image} alt={ex.name} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} />
                  : <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2a2a3e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⇄</div>
                }
                <div style={{ overflow: "hidden" }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ex.name}</p>
                  <p style={{ margin: 0, fontSize: 10, color: "#555" }}>
                    {ex.country || "Global"} · Est. {ex.year_established || "N/A"}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #1e1e3a", paddingTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ color: "#555", fontSize: 11 }}>Trust Score</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    {[...Array(10)].map((_, j) => (
                      <div
                        key={j}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: j < (ex.trust_score || 0) ? trustColor(ex.trust_score) : "#2a2a3e"
                        }}
                      />
                    ))}
                    <span style={{ fontSize: 10, color: trustColor(ex.trust_score), marginLeft: 4 }}>{ex.trust_score}/10</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#555", fontSize: 11 }}>24h Vol</span>
                  <span style={{ fontSize: 11, color: "#60a5fa" }}>
                    ₿ {(ex.trade_volume_24h_btc || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}