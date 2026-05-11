"use client"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

type Props = {
  coin: {
    id: string
    name: string
    symbol: string
    image: string
    current_price: number
    price_change_percentage_24h: number
    market_cap: number
  } | null
  onClose: () => void
}

type ChartPoint = {
  date: string
  price: number
}

export default function CoinModal({ coin, onClose }: Props) {
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState(7)

  useEffect(() => {
    if (!coin) return
    setLoading(true)
    fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=${range}`)
      .then(res => res.json())
      .then(data => {
        const points = (data.prices || []).map(([timestamp, price]: [number, number]) => ({
          date: range <= 7
            ? new Date(timestamp).toLocaleDateString("en-US", { weekday: "short" })
            : new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          price: parseFloat(price.toFixed(2))
        }))
        setChartData(points)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [coin, range])

  if (!coin) return null

  const isPositive = coin.price_change_percentage_24h > 0
  const chartColor = isPositive ? "#4ade80" : "#f87171"

  const minPrice = Math.min(...chartData.map(d => d.price))
  const maxPrice = Math.max(...chartData.map(d => d.price))

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="modal-inner" style={{ background: "#111122", border: "1px solid #2a2a3e", borderRadius: 20, padding: 24, width: "100%", maxWidth: 600, position: "relative" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "#1e1e3a", border: "none", borderRadius: 8, width: 32, height: 32, color: "#aaa", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >×</button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <img src={coin.image} alt={coin.name} style={{ width: 44, height: 44 }} />
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{coin.name}</h2>
            <p style={{ margin: 0, fontSize: 12, color: "#555" }}>{coin.symbol.toUpperCase()}</p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
              ${coin.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: isPositive ? "#4ade80" : "#f87171" }}>
              {isPositive ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}% today
            </p>
          </div>
        </div>

        {/* Range Selector */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[
            { label: "7D", value: 7 },
            { label: "30D", value: 30 },
            { label: "90D", value: 90 },
            { label: "1Y", value: 365 },
          ].map(r => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              style={{
                background: range === r.value ? "#3b82f6" : "#1a1a2e",
                border: "1px solid",
                borderColor: range === r.value ? "#3b82f6" : "#2a2a3e",
                borderRadius: 8,
                padding: "5px 12px",
                color: range === r.value ? "#fff" : "#666",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        {loading ? (
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#555" }}>Loading chart...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#555", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "#555", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `$${v.toLocaleString()}`}
                domain={[minPrice * 0.98, maxPrice * 1.02]}
                width={70}
              />
              <Tooltip
                contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#aaa" }}
                formatter={(value: any, name: any) => [`$${Number(value).toLocaleString()}`, coin.name]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: chartColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
          <div style={{ background: "#1a1a2e", borderRadius: 10, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#555" }}>Market Cap</p>
            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600 }}>
              ${(coin.market_cap / 1e9).toFixed(2)}B
            </p>
          </div>
          <div style={{ background: "#1a1a2e", borderRadius: 10, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#555" }}>24h Change</p>
            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: isPositive ? "#4ade80" : "#f87171" }}>
              {isPositive ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}