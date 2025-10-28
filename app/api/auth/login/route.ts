import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, createToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const token = await createToken(user)

    return NextResponse.json({ token, user })
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
