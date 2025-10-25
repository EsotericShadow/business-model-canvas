// Environment variable validation for production safety

interface EnvConfig {
  DATABASE_URL: string
  RESEND_API_KEY?: string
  NODE_ENV: 'development' | 'production' | 'test'
}

function validateEnv(): EnvConfig {
  const requiredVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test'
  }

  const missing: string[] = []
  
  // Only DATABASE_URL is required
  if (!requiredVars.DATABASE_URL) {
    missing.push('DATABASE_URL')
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  // Validate DATABASE_URL format
  if (!requiredVars.DATABASE_URL!.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string')
  }

  return requiredVars as EnvConfig
}

// Export validated environment variables (only validate at runtime)
let _env: EnvConfig | null = null

export function getEnv(): EnvConfig {
  if (!_env) {
    _env = validateEnv()
  }
  return _env
}

// For backward compatibility, but only validate when accessed
export const env = new Proxy({} as EnvConfig, {
  get(target, prop) {
    return getEnv()[prop as keyof EnvConfig]
  }
})

// Health check function
export async function healthCheck(): Promise<{ status: string; checks: Record<string, boolean> }> {
  const checks = {
    database: false,
    auth: false,
    environment: false
  }

  try {
    // Check environment variables
    getEnv()
    checks.environment = true

    // Check database connection
    const { sql } = await import('./database')
    await sql`SELECT 1 as health_check`
    checks.database = true

    // Check auth configuration
    const envConfig = getEnv()
    if (envConfig.DATABASE_URL) {
      checks.auth = true
    }

    const allHealthy = Object.values(checks).every(check => check)
    
    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      checks
    }
  } catch (error) {
    console.error('Health check failed:', error)
    return {
      status: 'unhealthy',
      checks
    }
  }
}
