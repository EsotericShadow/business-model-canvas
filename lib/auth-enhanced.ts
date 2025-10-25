// Enhanced authentication system with passwords and email verification
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export interface User {
  id: string
  email: string
  name?: string
  password_hash: string
  email_verified: boolean
  verification_token?: string
  created_at: Date
  updated_at: Date
}

// Simple in-memory user store (replace with database in production)
const users = new Map<string, User>()
const sessions = new Map<string, string>() // sessionId -> userId

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// User management
export async function createUser(email: string, password: string, name?: string): Promise<User> {
  // Check if user already exists
  const existingUser = getUserByEmail(email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // Validate password strength
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long')
  }

  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const password_hash = await hashPassword(password)
  const verification_token = crypto.randomBytes(32).toString('hex')
  
  const user: User = {
    id,
    email: email.toLowerCase().trim(),
    name: name?.trim(),
    password_hash,
    email_verified: false,
    verification_token,
    created_at: new Date(),
    updated_at: new Date()
  }
  
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
    if (user.email.toLowerCase() === email.toLowerCase()) return user
  }
  return null
}

// Authentication
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = getUserByEmail(email)
  if (!user) return null
  
  const isValidPassword = await verifyPassword(password, user.password_hash)
  if (!isValidPassword) return null
  
  return user
}

// Session management
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

// Email verification
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function verifyEmailToken(userId: string, token: string): boolean {
  const user = getUserById(userId)
  if (!user || user.verification_token !== token) return false
  
  // Mark email as verified
  user.email_verified = true
  user.verification_token = undefined
  user.updated_at = new Date()
  
  return true
}

// Password reset
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function resetPassword(userId: string, newPassword: string, resetToken: string): Promise<boolean> {
  const user = getUserById(userId)
  if (!user) return false
  
  // In a real app, you'd verify the reset token from a database
  // For now, we'll just update the password
  user.password_hash = await hashPassword(newPassword)
  user.updated_at = new Date()
  
  return true
}
