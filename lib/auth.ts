// Simple authentication system for Vercel deployment
// This replaces Stack Auth with a lightweight solution

export interface User {
  id: string
  email: string
  name?: string
}

// Simple in-memory user store (replace with database in production)
const users = new Map<string, User>()

export function createUser(email: string, name?: string): User {
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const user: User = { id, email, name }
  users.set(id, user)
  return user
}

export function getUserById(id: string): User | null {
  return users.get(id) || null
}

export function getUserByEmail(email: string): User | null {
  const userArray = Array.from(users.values())
  for (let i = 0; i < userArray.length; i++) {
    const user = userArray[i]
    if (user.email === email) return user
  }
  return null
}

// Simple session management
const sessions = new Map<string, string>() // sessionId -> userId

export function createSession(userId: string): string {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  sessions.set(sessionId, userId)
  return sessionId
}

export function getUserIdFromSession(sessionId: string): string | null {
  return sessions.get(sessionId) || null
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId)
}
