"use client"
import { useState } from "react"
import Header from "./components/Header"
import TabBar from "./components/TabBar"
import CryptoPage from "./components/CryptoPage"
import NftPage from "./components/NftPage"
import ExchangePage from "./components/ExchangePage"
import NewsPage from "./components/NewsPage"
import ErrorBoundary from "./components/ErrorBoundary"

type Tab = "crypto" | "nft" | "exchange" | "news"

export default function Home() {
  const [tab, setTab] = useState<Tab>("crypto")
  const [wallet, setWallet] = useState("")
  const [connecting, setConnecting] = useState(false)

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", padding: "1rem", fontFamily: "sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.2rem" }}>
        <Header wallet={wallet} setWallet={setWallet} connecting={connecting} setConnecting={setConnecting} />
      </div>

      {/* Tab Bar */}
      <div style={{ marginBottom: "1.5rem" }}>
        <TabBar active={tab} setActive={setTab} />
      </div>

      {/* Page Content */}
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <ErrorBoundary fallback="Crypto page failed to load">
          {tab === "crypto" && <CryptoPage wallet={wallet} />}
        </ErrorBoundary>
        <ErrorBoundary fallback="NFT page failed to load">
          {tab === "nft" && <NftPage />}
        </ErrorBoundary>
        <ErrorBoundary fallback="Exchange page failed to load">
          {tab === "exchange" && <ExchangePage />}
        </ErrorBoundary>
        <ErrorBoundary fallback="News page failed to load">
          {tab === "news" && <NewsPage />}
        </ErrorBoundary>
      </div>

      <p style={{ textAlign: "center", color: "#222", fontSize: 11, marginTop: 40 }}>
        Built by Hameedayo
      </p>
    </main>
  )
}