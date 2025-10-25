const { neon } = require('@neondatabase/serverless')

async function testDatabase() {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT 1 as test`
    console.log('✅ Database connection successful:', result)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  }
}

testDatabase()
