export function SkeletonCard() {
  return (
    <div style={{ background: "#111122", border: "1px solid #1e1e3a", borderRadius: 11, padding: "11px 13px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
        <div className="skeleton" style={{ width: 20, height: 20, borderRadius: "50%" }} />
        <div>
          <div className="skeleton" style={{ width: 40, height: 10, borderRadius: 4, marginBottom: 4 }} />
          <div className="skeleton" style={{ width: 60, height: 8, borderRadius: 4 }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: 80, height: 14, borderRadius: 4, marginBottom: 6 }} />
      <div className="skeleton" style={{ width: 50, height: 10, borderRadius: 4 }} />
    </div>
  )
}

export function SkeletonNewsCard() {
  return (
    <div style={{ background: "#111122", border: "1px solid #1e1e3a", borderRadius: 12, overflow: "hidden" }}>
      <div className="skeleton" style={{ width: "100%", height: 140 }} />
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div className="skeleton" style={{ width: 70, height: 18, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: 40, height: 10, borderRadius: 4 }} />
        </div>
        <div className="skeleton" style={{ width: "100%", height: 12, borderRadius: 4, marginBottom: 6 }} />
        <div className="skeleton" style={{ width: "80%", height: 12, borderRadius: 4, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: "100%", height: 10, borderRadius: 4, marginBottom: 4 }} />
        <div className="skeleton" style={{ width: "60%", height: 10, borderRadius: 4 }} />
      </div>
    </div>
  )
}

export function SkeletonExchangeCard() {
  return (
    <div style={{ background: "#111122", border: "1px solid #1e1e3a", borderRadius: 12, padding: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div className="skeleton" style={{ width: 20, height: 10, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
        <div>
          <div className="skeleton" style={{ width: 80, height: 12, borderRadius: 4, marginBottom: 4 }} />
          <div className="skeleton" style={{ width: 60, height: 9, borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ borderTop: "1px solid #1e1e3a", paddingTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div className="skeleton" style={{ width: 60, height: 10, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: 80, height: 10, borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="skeleton" style={{ width: 50, height: 10, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: 70, height: 10, borderRadius: 4 }} />
        </div>
      </div>
    </div>
  )
}