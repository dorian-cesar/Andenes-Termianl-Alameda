import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { action, user } = await request.json()

    // Simulate barrier control command
    console.log(`[v0] Barrier ${id} - Action: ${action} by ${user}`)

    // In production, this would send actual commands to barrier hardware
    // For now, we simulate a successful response
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      barrierId: id,
      action,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al controlar la barrera" }, { status: 500 })
  }
}
