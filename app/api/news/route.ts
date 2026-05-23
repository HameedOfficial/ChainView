import { NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.GNEWS_KEY || ""

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "bitcoin"

  try {
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=40&apikey=${API_KEY}`,
      { next: { revalidate: 300 } }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}