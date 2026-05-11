"use client"
import { useEffect, useState } from "react"

type NFT = {
  collection: string
  name: string
  image_url: string
  floor_price: number
  one_day_volume: number
  num_owners: number
  opensea_url: string
}

const API_KEY = process.env.NEXT_PUBLIC_OPENSEA_KEY || "1fb5797363da44d7a5329427a0b50079"

const TOP_COLLECTIONS = [
  "pudgypenguins", "boredapeyachtclub", "mutant-ape-yacht-club",
  "azuki", "doodles-official", "clonex", "cryptopunks",
  "moonbirds", "sandbox", "decentraland",
  "meebits", "veefriends", "world-of-women-nft",
  "cool-cats-nft", "artgobblers", "proof-moonbirds",
  "beanzofficial", "degods", "y00ts", "milady"
]

export default function NftPage() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  const fetchNFTs = async () => {
    setLoading(true)
    setError("")
    try {
      const results = await Promise.allSettled(
        TOP_COLLECTIONS.map(slug =>
          fetch(`https://api.opensea.io/api/v2/collections/${slug}/stats`, {
            headers: {
              "accept": "application/json",
              "x-api-key": API_KEY
            }
          }).then(r => r.json()).then(stats => ({slug, stats}))
        )
      )

      // also fetch collection info for images
      const infoResults = await Promise.allSettled(
        TOP_COLLECTIONS.map(slug =>
          fetch(`https://api.opensea.io/api/v2/collections/${slug}`, {
            headers: {
              "accept": "application/json",
              "x-api-key": API_KEY
            }
          }).then(r => r.json())
        )
      )

      const mapped: NFT[] = TOP_COLLECTIONS.map((slug, i) => {
        const statsResult = results[i]
        const infoResult = infoResults[i]

        const stats = statsResult.status === "fulfilled" ? statsResult.value.stats : null
        const info = infoResult.status === "fulfilled" ? infoResult.value : null

        return {
          collection: slug,
          name: info?.name || slug,
          image_url: info?.image_url || info?.banner_image_url || "",
          floor_price: stats?.total?.floor_price || 0,
          one_day_volume: stats?.intervals?.[0]?.volume || 0,
          num_owners: stats?.total?.num_owners || 0,
          opensea_url: info?.opensea_url || `https://opensea.io/collection/${slug}`
        }
      }).filter(n => n.name)

      setNfts(mapped)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNFTs() }, [])

  const filtered = nfts.filter(n =>
    n.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <p style={{ color: "#555", textAlign: "center", padding: "3rem 0" }}>Loading NFT collections...</p>
  )

  if (error) return (
    <div style={{ textAlign: "center", padding: "3rem 0" }}>
      <p style={{ color: "#f87171", marginBottom: 8 }}>Failed to load: {error}</p>
      <button
        onClick={fetchNFTs}
        style={{ background: "#3b82f6", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", fontSize: 13 }}
      >Retry</button>
    </div>
  )

  return (
    <div>
     <div className="controls-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <p style={{ color: "#555", margin: 0, fontSize: 13 }}>{filtered.length} top NFT collections · live stats</p>
        <input
          type="text"
          placeholder="Search collections..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input" style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 10, padding: "7px 13px", color: "#fff", fontSize: 13, outline: "none", width: 200 }}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "#555", textAlign: "center", padding: "3rem 0" }}>No collections found.</p>
      ) : (
       <div className="grid-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {filtered.map((nft, i) => (
            <a
              key={nft.collection}
              href={nft.opensea_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{ background: "#111122", border: "1px solid #1e1e3a", borderRadius: 12, overflow: "hidden", height: "100%", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#8b5cf6")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e1e3a")}
              >
                {nft.image_url ? (
                  <img
                    src={nft.image_url}
                    alt={nft.name}
                    style={{ width: "100%", height: 120, objectFit: "cover" }}
                    onError={e => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div style={{ width: "100%", height: 120, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🖼</div>
                )}

                <div style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span style={{ color: "#444", fontSize: 10 }}>#{i + 1}</span>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nft.name}</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#555", fontSize: 11 }}>Floor</span>
                      <span style={{ fontSize: 11, fontWeight: 600 }}>
                        {nft.floor_price > 0 ? `${nft.floor_price.toFixed(3)} ETH` : "—"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#555", fontSize: 11 }}>24h Vol</span>
                      <span style={{ fontSize: 11, color: "#60a5fa" }}>
                        {nft.one_day_volume > 0 ? `${nft.one_day_volume.toFixed(2)} ETH` : "—"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#555", fontSize: 11 }}>Owners</span>
                      <span style={{ fontSize: 11, color: "#a78bfa" }}>
                        {nft.num_owners > 0 ? nft.num_owners.toLocaleString() : "—"}
                      </span>
                    </div>
                  </div>
                  <p style={{ margin: "10px 0 0", fontSize: 10, color: "#8b5cf6" }}>View on OpenSea ↗</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}