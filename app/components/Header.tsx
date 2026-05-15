"use client"
import { ethers } from "ethers"

type Props = {
  wallet: string
  setWallet: (w: string) => void
  connecting: boolean
  setConnecting: (b: boolean) => void
}

export default function Header({ wallet, setWallet, connecting, setConnecting }: Props) {
  const connectWallet = async () => {
    try {
      setConnecting(true)
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      setWallet(accounts[0])
    } catch (err) {
      console.error(err)
    } finally {
      setConnecting(false)
    }
  }

  const short = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: "#fff"
        }}>
          CV
        </div>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#fff", letterSpacing: -0.5 }}>
            Chain<span style={{ color: "#3b82f6" }}>View</span>
          </h1>
          <p style={{ color: "#444", margin: 0, fontSize: 10, letterSpacing: 0.3 }}>WEB3 DASHBOARD</p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {/* Live dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80", animation: "pulse 2s infinite", flexShrink: 0 }} />
        </div>

        {wallet ? (
          <div style={{ background: "#0d2818", border: "1px solid #1a5c35", borderRadius: 10, padding: "7px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
            <span style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 11 }}>{short(wallet)}</span>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={connecting}
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              border: "none", borderRadius: 10, padding: "8px 12px",
              color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </div>
  )
}