import { jwtVerify, SignJWT } from "jose"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "operator"
}

export async function createToken(user: User): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY)

  return token
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload.user as User
  } catch (error) {
    return null
  }
}

// Mock user database - replace with real database
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@terminal.com",
    password: "admin123",
    name: "Administrador",
    role: "admin" as const,
  },
  {
    id: "2",
    email: "operador@terminal.com",
    password: "operador123",
    name: "Operador",
    role: "operator" as const,
  },
]

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password)
  if (!user) return null

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
