type Tab = "crypto" | "nft" | "exchange" | "news"

type Props = {
  active: Tab
  setActive: (t: Tab) => void
}

export default function TabBar({ active, setActive }: Props) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "crypto", label: "Markets", icon: "₿" },
    { id: "nft", label: "NFTs", icon: "🖼" },
    { id: "exchange", label: "Exchanges", icon: "⇄" },
    { id: "news", label: "News", icon: "📰" },
  ]

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", borderBottom: "1px solid #1e1e3a" }}>
      <div className="tab-scroll" style={{ display: "flex", gap: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: active === tab.id ? "2px solid #3b82f6" : "2px solid transparent",
              padding: "12px 16px",
              color: active === tab.id ? "#3b82f6" : "#555",
              fontSize: 13,
              fontWeight: active === tab.id ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: -1,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 14 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}