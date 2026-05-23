"use client"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import CoinModal from "./CoinModal"
import { SkeletonCard } from "./Skeleton"

type Coin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
}

type TokenBalance = {
  symbol: string
  name: string
  balance: string
  image: string
  usdValue: number
}

type Props = {
  wallet: string
}

export default function CryptoPage({ wallet }: Props) {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [loadingBalances, setLoadingBalances] = useState(false)
  const [search, setSearch] = useState("")
  const [fetched, setFetched] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null)
  const [visibleCount, setVisibleCount] = useState(14)
 useEffect(() => {
    setLoading(true)
    // Load first 100 instantly, then load the rest in background
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
      .then(res => res.json())
      .then(first100 => {
        setCoins(first100)
        setLoading(false)
        // Now load remaining 900 in background
        const pages = [2, 3, 4]
        Promise.all(
          pages.map(page =>
            fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&sparkline=false`)
              .then(res => res.json())
          )
        ).then(results => {
          const rest = results.flat().filter((c: any) => c && c.id)
          setCoins(prev => [...prev, ...rest])
        })
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (wallet && coins.length > 0 && !fetched) {
      setFetched(true)
      fetchBalances(wallet, coins)
    }
  }, [wallet, coins, fetched])

  const fetchBalances = async (address: string, coinList: Coin[]) => {
    setLoadingBalances(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const ethBalance = await provider.getBalance(address)
      const ethFormatted = parseFloat(ethers.formatEther(ethBalance))
      const ethCoin = coinList.find(c => c.id === "ethereum")
      const result: TokenBalance[] = []

      if (ethFormatted > 0) {
        result.push({
          symbol: "ETH",
          name: "Ethereum",
          balance: ethFormatted.toFixed(4),
          image: ethCoin?.image || "",
          usdValue: ethFormatted * (ethCoin?.current_price || 0)
        })
      }

      const tokens = [
        { symbol: "USDT", name: "Tether", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
        { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
        { symbol: "LINK", name: "Chainlink", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", decimals: 18 },
        { symbol: "UNI", name: "Uniswap", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", decimals: 18 },
        { symbol: "SHIB", name: "Shiba Inu", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", decimals: 18 },
      ]

      const abi = ["function balanceOf(address owner) view returns (uint256)"]
      for (const t of tokens) {
        try {
          const contract = new ethers.Contract(t.address, abi, provider)
          const raw = await contract.balanceOf(address)
          const amt = parseFloat(ethers.formatUnits(raw, t.decimals))
          if (amt > 0) {
            const match = coinList.find(c => c.symbol.toLowerCase() === t.symbol.toLowerCase())
            result.push({
              symbol: t.symbol,
              name: t.name,
              balance: amt.toFixed(4),
              image: match?.image || "",
              usdValue: match ? amt * match.current_price : 0
            })
          }
        } catch {}
      }
      setBalances(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingBalances(false)
    }
  }

  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  )

  const totalUsd = balances.reduce((s, b) => s + b.usdValue, 0)

  return (
    <div>
      {/* Wallet Balances */}
      {wallet && (
        <div style={{ background: "#111122", border: "1px solid #1e1e3a", borderRadius: 14, padding: "1.2rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Your Wallet</h2>
            {!loadingBalances && balances.length > 0 && (
              <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 17 }}>
                ${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
          {loadingBalances ? (
            <p style={{ color: "#555", fontSize: 13, margin: 0 }}>Scanning wallet...</p>
          ) : balances.length === 0 ? (
            <p style={{ color: "#555", fontSize: 13, margin: 0 }}>No token balances found on Ethereum mainnet.</p>
          ) : (
            <div className="wallet-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
               {balances.map(b => (
                <div key={b.symbol} style={{ background: "#1a1a2e", borderRadius: 10, padding: "10px 12px", border: "1px solid #2a2a3e" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    {b.image && <img src={b.image} alt={b.symbol} style={{ width: 18, height: 18 }} />}
                    <span style={{ fontSize: 11, color: "#888" }}>{b.name}</span>
                  </div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{b.balance} {b.symbol}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "#4ade80" }}>
                    ${b.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search */}
      <div className="controls-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <p style={{ color: "#555", margin: 0, fontSize: 13 }}>
          Top 1000 cryptocurrencies · click any coin for chart
        </p>
        <input
          type="text"
          placeholder="Search coins..."
          value={search}
          onChange={e => { setSearch(e.target.value); setVisibleCount(14) }}
          className="search-input"
          style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 10, padding: "7px 13px", color: "#fff", fontSize: 13, outline: "none", width: 190 }}
        />
      </div>

      {/* Coins Grid */}
      {loading ? (
        <div className="grid-coins" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
          {[...Array(14)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#555", textAlign: "center", padding: "3rem 0" }}>No coins found.</p>
      ) : (
        <>
          <div className="grid-coins" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            {filtered.slice(0, visibleCount).map((coin, index) => (
              <div
                key={`${coin.id}-${index}`}
                onClick={() => setSelectedCoin(coin)}
                style={{ background: "#111122", border: "1px solid #1e1e3a", borderRadius: 11, padding: "11px 13px", transition: "border-color 0.2s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#3b82f6")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e1e3a")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                  <img src={coin.image} alt={coin.name} style={{ width: 20, height: 20 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 600 }}>{coin.symbol.toUpperCase()}</p>
                    <p style={{ margin: 0, fontSize: 9, color: "#555" }}>{coin.name}</p>
                  </div>
                </div>
                <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700 }}>
                  ${coin.current_price < 0.01
                    ? coin.current_price.toFixed(6)
                    : coin.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: coin.price_change_percentage_24h > 0 ? "#4ade80" : "#f87171" }}>
                  {coin.price_change_percentage_24h > 0 ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 24 }}>

            {/* Coins counter */}
            <p style={{ color: "#555", fontSize: 12, margin: 0 }}>
              Showing <span style={{ color: "#fff", fontWeight: 600 }}>{Math.min(visibleCount, filtered.length)}</span> of <span style={{ color: "#fff", fontWeight: 600 }}>{filtered.length}</span> coins
            </p>

            <div style={{ display: "flex", gap: 8 }}>
              {/* Load More */}
              {visibleCount < filtered.length && (
                <button
                  onClick={() => setVisibleCount(v => Math.min(v + 14, filtered.length))}
                  style={{
                    background: "#1a1a2e", border: "1px solid #2a2a3e",
                    borderRadius: 10, padding: "8px 16px",
                    color: "#fff", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#3b82f6")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a3e")}
                >
                  Load 14 More ↓
                </button>
              )}

              {/* Show Less — only show if more than 14 visible */}
              {visibleCount > 14 && (
                <button
                  onClick={() => setVisibleCount(14)}
                  style={{
                    background: "transparent", border: "1px solid #2a2a3e",
                    borderRadius: 10, padding: "8px 16px",
                    color: "#555", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#f87171")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a3e")}
                >
                  Show Less ↑
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Chart Modal */}
      <CoinModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
    </div>
  )
}