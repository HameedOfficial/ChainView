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
    <div className="header-wrap" style={{ maxWidth: 1300, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: "#fff"
        }}>
          CV
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#fff", letterSpacing: -0.5 }}>
            Chain<span style={{ color: "#3b82f6" }}>View</span>
          </h1>
          <p className="hide-mobile" style={{ color: "#444", margin: 0, fontSize: 11, letterSpacing: 0.5 }}>YOUR COMPLETE WEB3 DASHBOARD</p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80", animation: "pulse 2s infinite" }} />
          <span className="hide-mobile" style={{ color: "#444", fontSize: 11, letterSpacing: 0.5 }}>LIVE</span>
        </div>

        {wallet ? (
          <div style={{ background: "#0d2818", border: "1px solid #1a5c35", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
            <span style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 12 }}>{short(wallet)}</span>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={connecting}
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              border: "none", borderRadius: 10, padding: "9px 16px",
              color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap"
            }}
          >
            <span>⬡</span>
            <span className="hide-mobile">{connecting ? "Connecting..." : "Connect Wallet"}</span>
            <span className="show-mobile" style={{ display: "none" }}>{connecting ? "..." : "Connect"}</span>
          </button>
        )}
      </div>
    </div>
  )
}