// Database-backed authentication system
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { Resend } from 'resend'
import { sql } from './database'

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
  try {
    console.log('Creating user for email:', email)
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      console.log('User already exists:', email)
      throw new Error('User with this email already exists')
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const password_hash = await hashPassword(password)
    const verification_token = generateVerificationToken()
    
    console.log('Inserting user into database:', id)
    
    // Insert user into database
    await sql`
      INSERT INTO users (id, email, name, password_hash, email_verified, verification_token, created_at, updated_at)
      VALUES (${id}, ${email.toLowerCase().trim()}, ${name?.trim() || null}, ${password_hash}, false, ${verification_token}, NOW(), NOW())
    `
    
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
    
    console.log('User created successfully:', user.id)
    
    // Send verification email
    try {
      await sendVerificationEmail(user.email, verification_token, user.name)
      console.log('Verification email sent to:', user.email)
    } catch (error) {
      console.error('Failed to send verification email:', error)
      // Don't throw here - user is created, just email failed
    }
    
    return user
  } catch (error) {
    console.error('Error in createUser:', error)
    throw error
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, email, name, password_hash, email_verified, verification_token, created_at, updated_at
      FROM users 
      WHERE id = ${id}
    `
    
    if (result.length === 0) return null
    
    const row = result[0]
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      password_hash: row.password_hash,
      email_verified: row.email_verified,
      verification_token: row.verification_token,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    }
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, email, name, password_hash, email_verified, verification_token, created_at, updated_at
      FROM users 
      WHERE email = ${email.toLowerCase().trim()}
    `
    
    if (result.length === 0) return null
    
    const row = result[0]
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      password_hash: row.password_hash,
      email_verified: row.email_verified,
      verification_token: row.verification_token,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    }
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

// Authentication
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    console.log('Authenticating user:', email)
    
    const user = await getUserByEmail(email)
    if (!user) {
      console.log('User not found:', email)
      return null
    }
    
    console.log('User found, verifying password...')
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      console.log('Invalid password for user:', email)
      return null
    }
    
    console.log('Authentication successful for user:', user.id)
    return user
  } catch (error) {
    console.error('Error in authenticateUser:', error)
    return null
  }
}

// Session management (still in-memory for now, but could be moved to database)
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

// Email verification
export function generateVerificationToken(): string {
  // Generate a 6-digit verification code
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Initialize Resend (only if API key is available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Send verification email using Resend
export async function sendVerificationEmail(email: string, token: string, name?: string): Promise<void> {
  if (!resend) {
    console.log(`--- EMAIL VERIFICATION (Development) ---`)
    console.log(`To: ${email}`)
    console.log(`Subject: Verify your email for Business Model Canvas`)
    console.log(`Token: ${token}`)
    console.log(`----------------------------------------`)
    return
  }

  try {
    await resend.emails.send({
      from: 'gabriel@evergreenwebsolutions.ca',
      to: [email],
      subject: 'Verify your email for Business Model Canvas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Welcome to Business Model Canvas!</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Thank you for signing up for our Business Model Canvas tool. To complete your registration, please verify your email address.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Verification Token:</h3>
            <p style="font-family: monospace; font-size: 18px; font-weight: bold; color: #2563eb; background-color: white; padding: 10px; border-radius: 4px; text-align: center; letter-spacing: 2px;">${token}</p>
          </div>
          
          <p>Enter this token in the verification form to activate your account.</p>
          
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't create an account with us, please ignore this email.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            This email was sent from Evergreen Web Solutions<br>
            Business Model Canvas Tool
          </p>
        </div>
      `
    })
    console.log(`✅ Verification email sent to ${email}`)
  } catch (error) {
    console.error('❌ Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

export async function verifyEmailToken(userId: string, token: string): Promise<boolean> {
  try {
    const user = await getUserById(userId)
    if (!user || user.verification_token !== token) return false
    
    // Update user in database
    await sql`
      UPDATE users 
      SET email_verified = true, verification_token = NULL, updated_at = NOW()
      WHERE id = ${userId}
    `
    
    return true
  } catch (error) {
    console.error('Error verifying email token:', error)
    return false
  }
}

// Password reset
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function resetPassword(userId: string, newPassword: string, resetToken: string): Promise<boolean> {
  try {
    const user = await getUserById(userId)
    if (!user) return false
    
    // In a real app, you'd verify the reset token from a database
    // For now, we'll just update the password
    const newPasswordHash = await hashPassword(newPassword)
    
    await sql`
      UPDATE users 
      SET password_hash = ${newPasswordHash}, updated_at = NOW()
      WHERE id = ${userId}
    `
    
    return true
  } catch (error) {
    console.error('Error resetting password:', error)
    return false
  }
}
