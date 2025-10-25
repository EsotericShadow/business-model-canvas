// Database backup and disaster recovery system
import { sql } from './database'
import { PerformanceMonitor, ErrorTracker } from './monitoring'

export interface BackupResult {
  success: boolean
  timestamp: string
  size: number
  tables: string[]
  error?: string
}

export interface RestoreResult {
  success: boolean
  timestamp: string
  tables: string[]
  error?: string
}

// Create database backup
export async function createBackup(): Promise<BackupResult> {
  const startTime = Date.now()
  
  try {
    // Get all table names
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    ` as any[]
    
    const tableNames = tables.map(t => t.table_name)
    
    // Create backup data structure
    const backupData: any = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      tables: {}
    }
    
    // Backup each table
    for (const tableName of tableNames) {
      try {
        const data = await sql`SELECT * FROM ${sql(tableName)}` as any[]
        backupData.tables[tableName] = data
      } catch (error) {
        console.error(`Error backing up table ${tableName}:`, error)
        ErrorTracker.recordError(error as Error, { table: tableName, operation: 'backup' })
      }
    }
    
    const backupSize = JSON.stringify(backupData).length
    const duration = Date.now() - startTime
    
    // Record performance metrics
    PerformanceMonitor.recordMetric('backup_duration', duration)
    PerformanceMonitor.recordMetric('backup_size', backupSize)
    
    return {
      success: true,
      timestamp: backupData.timestamp,
      size: backupSize,
      tables: tableNames
    }
  } catch (error) {
    ErrorTracker.recordError(error as Error, { operation: 'backup' })
    return {
      success: false,
      timestamp: new Date().toISOString(),
      size: 0,
      tables: [],
      error: (error as Error).message
    }
  }
}

// Restore database from backup
export async function restoreBackup(backupData: any): Promise<RestoreResult> {
  const startTime = Date.now()
  
  try {
    if (!backupData.tables) {
      throw new Error('Invalid backup data format')
    }
    
    const tableNames = Object.keys(backupData.tables)
    
    // Restore each table
    for (const tableName of tableNames) {
      const tableData = backupData.tables[tableName]
      
      if (Array.isArray(tableData) && tableData.length > 0) {
        // Clear existing data
        if (tableName === 'users') {
          await sql`DELETE FROM users`
        } else if (tableName === 'business_model_canvas') {
          await sql`DELETE FROM business_model_canvas`
        } else if (tableName === 'canvas_versions') {
          await sql`DELETE FROM canvas_versions`
        }
        
        // Insert backup data (simplified approach)
        if (tableName === 'users' && tableData.length > 0) {
          for (const row of tableData) {
            await sql`
              INSERT INTO users (id, email, name, created_at, updated_at)
              VALUES (${row.id}, ${row.email}, ${row.name}, ${row.created_at}, ${row.updated_at})
            `
          }
        } else if (tableName === 'business_model_canvas' && tableData.length > 0) {
          for (const row of tableData) {
            await sql`
              INSERT INTO business_model_canvas (
                id, user_id, key_partners, key_activities, value_propositions,
                customer_relationships, customer_segments, key_resources,
                channels, cost_structure, revenue_streams, share_token,
                created_at, updated_at
              ) VALUES (
                ${row.id}, ${row.user_id}, ${row.key_partners}, ${row.key_activities},
                ${row.value_propositions}, ${row.customer_relationships}, ${row.customer_segments},
                ${row.key_resources}, ${row.channels}, ${row.cost_structure},
                ${row.revenue_streams}, ${row.share_token}, ${row.created_at}, ${row.updated_at}
              )
            `
          }
        } else if (tableName === 'canvas_versions' && tableData.length > 0) {
          for (const row of tableData) {
            await sql`
              INSERT INTO canvas_versions (
                id, canvas_id, key_partners, key_activities, value_propositions,
                customer_relationships, customer_segments, key_resources,
                channels, cost_structure, revenue_streams, saved_at
              ) VALUES (
                ${row.id}, ${row.canvas_id}, ${row.key_partners}, ${row.key_activities},
                ${row.value_propositions}, ${row.customer_relationships}, ${row.customer_segments},
                ${row.key_resources}, ${row.channels}, ${row.cost_structure},
                ${row.revenue_streams}, ${row.saved_at}
              )
            `
          }
        }
      }
    }
    
    const duration = Date.now() - startTime
    PerformanceMonitor.recordMetric('restore_duration', duration)
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
      tables: tableNames
    }
  } catch (error) {
    ErrorTracker.recordError(error as Error, { operation: 'restore' })
    return {
      success: false,
      timestamp: new Date().toISOString(),
      tables: [],
      error: (error as Error).message
    }
  }
}

// Export user data (GDPR compliance)
export async function exportUserData(userId: string): Promise<any> {
  try {
    const userData = {
      user: await sql`SELECT * FROM users WHERE id = ${userId}` as any[],
      canvas: await sql`SELECT * FROM business_model_canvas WHERE user_id = ${userId}` as any[],
      versions: await sql`SELECT * FROM canvas_versions WHERE canvas_id IN (
        SELECT id FROM business_model_canvas WHERE user_id = ${userId}
      )` as any[]
    }
    
    return {
      exportDate: new Date().toISOString(),
      userId,
      data: userData
    }
  } catch (error) {
    ErrorTracker.recordError(error as Error, { operation: 'export_user_data', userId })
    throw error
  }
}

// Delete user data (GDPR compliance)
export async function deleteUserData(userId: string): Promise<boolean> {
  try {
    // Delete in correct order (foreign key constraints)
    await sql`DELETE FROM canvas_versions WHERE canvas_id IN (
      SELECT id FROM business_model_canvas WHERE user_id = ${userId}
    )`
    
    await sql`DELETE FROM business_model_canvas WHERE user_id = ${userId}`
    
    await sql`DELETE FROM users WHERE id = ${userId}`
    
    return true
  } catch (error) {
    ErrorTracker.recordError(error as Error, { operation: 'delete_user_data', userId })
    return false
  }
}

// Backup verification
export async function verifyBackup(backupData: any): Promise<boolean> {
  try {
    if (!backupData.tables) return false
    
    // Check if all expected tables are present
    const expectedTables = ['users', 'business_model_canvas', 'canvas_versions']
    const backupTables = Object.keys(backupData.tables)
    
    return expectedTables.every(table => backupTables.includes(table))
  } catch (error) {
    ErrorTracker.recordError(error as Error, { operation: 'verify_backup' })
    return false
  }
}
