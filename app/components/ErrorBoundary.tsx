"use client"
import { Component, ReactNode } from "react"

type Props = {
  children: ReactNode
  fallback?: string
}

type State = {
  hasError: boolean
  error: string
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: "" }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message }
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: "#f87171", fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
            {this.props.fallback || "Something went wrong"}
          </h2>
          <p style={{ color: "#555", fontSize: 13, marginBottom: 24 }}>
            {this.state.error || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: "" })}
            style={{ background: "#3b82f6", border: "none", borderRadius: 8, padding: "9px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}