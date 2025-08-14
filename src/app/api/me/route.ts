import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession()

  if (session) {
    return NextResponse.json({ user: session.user })
  } else {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
}