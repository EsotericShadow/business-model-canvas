'use server'

import { sql } from './database'

// Database types
export interface CanvasData {
  id?: string
  user_id?: string
  key_partners: string
  key_activities: string
  value_propositions: string
  customer_relationships: string
  customer_segments: string
  key_resources: string
  channels: string
  cost_structure: string
  revenue_streams: string
  share_token?: string
  created_at?: string
  updated_at?: string
}

export interface CanvasVersion {
  id: string
  canvas_id: string
  key_partners: string
  key_activities: string
  value_propositions: string
  customer_relationships: string
  customer_segments: string
  key_resources: string
  channels: string
  cost_structure: string
  revenue_streams: string
  saved_at: string
}

// Get user's canvas (or create from template)
export async function getUserCanvas(userId: string) {
  try {
    // First, try to get user's existing canvas
    let result = await sql`
      SELECT * FROM business_model_canvas 
      WHERE user_id = ${userId}
      LIMIT 1
    ` as any[]
    
    if (result.length === 0) {
      // Create new canvas from template
      const template = await sql`
        SELECT * FROM business_model_canvas 
        WHERE user_id IS NULL AND share_token = 'demo-canvas'
        LIMIT 1
      ` as any[]
      
      if (template.length > 0) {
        const newCanvas = await sql`
          INSERT INTO business_model_canvas (
            user_id, key_partners, key_activities, value_propositions,
            customer_relationships, customer_segments, key_resources,
            channels, cost_structure, revenue_streams, share_token
          ) VALUES (
            ${userId},
            ${template[0].key_partners},
            ${template[0].key_activities},
            ${template[0].value_propositions},
            ${template[0].customer_relationships},
            ${template[0].customer_segments},
            ${template[0].key_resources},
            ${template[0].channels},
            ${template[0].cost_structure},
            ${template[0].revenue_streams},
            ${crypto.randomUUID()}
          ) RETURNING *
        ` as any[]
        result = newCanvas
      }
    }
    
    return result[0] || null
  } catch (error) {
    console.error('Error fetching user canvas:', error)
    return null
  }
}

// Save canvas and create version history
export async function saveCanvas(userId: string, canvasData: CanvasData) {
  try {
    // Get current canvas
    const currentCanvas = await sql`
      SELECT * FROM business_model_canvas 
      WHERE user_id = ${userId}
      LIMIT 1
    ` as any[]
    
    if (currentCanvas.length > 0) {
      // Save current state as version
      await sql`
        INSERT INTO canvas_versions (
          canvas_id, key_partners, key_activities, value_propositions,
          customer_relationships, customer_segments, key_resources,
          channels, cost_structure, revenue_streams
        ) VALUES (
          ${currentCanvas[0].id},
          ${currentCanvas[0].key_partners},
          ${currentCanvas[0].key_activities},
          ${currentCanvas[0].value_propositions},
          ${currentCanvas[0].customer_relationships},
          ${currentCanvas[0].customer_segments},
          ${currentCanvas[0].key_resources},
          ${currentCanvas[0].channels},
          ${currentCanvas[0].cost_structure},
          ${currentCanvas[0].revenue_streams}
        )
      `
      
      // Update current canvas
      const result = await sql`
        UPDATE business_model_canvas 
        SET 
          key_partners = ${canvasData.key_partners},
          key_activities = ${canvasData.key_activities},
          value_propositions = ${canvasData.value_propositions},
          customer_relationships = ${canvasData.customer_relationships},
          customer_segments = ${canvasData.customer_segments},
          key_resources = ${canvasData.key_resources},
          channels = ${canvasData.channels},
          cost_structure = ${canvasData.cost_structure},
          revenue_streams = ${canvasData.revenue_streams},
          updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      ` as any[]
      return result[0]
    } else {
      // Create new canvas
      const result = await sql`
        INSERT INTO business_model_canvas (
          user_id, key_partners, key_activities, value_propositions,
          customer_relationships, customer_segments, key_resources,
          channels, cost_structure, revenue_streams, share_token
        ) VALUES (
          ${userId},
          ${canvasData.key_partners},
          ${canvasData.key_activities},
          ${canvasData.value_propositions},
          ${canvasData.customer_relationships},
          ${canvasData.customer_segments},
          ${canvasData.key_resources},
          ${canvasData.channels},
          ${canvasData.cost_structure},
          ${canvasData.revenue_streams},
          ${crypto.randomUUID()}
        ) RETURNING *
      ` as any[]
      return result[0]
    }
  } catch (error) {
    console.error('Error saving canvas:', error)
    throw error
  }
}

// Get version history
export async function getCanvasVersions(canvasId: string) {
  try {
    const result = await sql`
      SELECT * FROM canvas_versions 
      WHERE canvas_id = ${canvasId}
      ORDER BY saved_at DESC
    `
    return result
  } catch (error) {
    console.error('Error fetching canvas versions:', error)
    return []
  }
}

// Restore version
export async function restoreVersion(canvasId: string, versionId: string) {
  try {
    // Get the version to restore
    const version = await sql`
      SELECT * FROM canvas_versions 
      WHERE id = ${versionId} AND canvas_id = ${canvasId}
      LIMIT 1
    ` as any[]
    
    if (version.length === 0) {
      throw new Error('Version not found')
    }
    
    // Update current canvas with version data
    const result = await sql`
      UPDATE business_model_canvas 
      SET 
        key_partners = ${version[0].key_partners},
        key_activities = ${version[0].key_activities},
        value_propositions = ${version[0].value_propositions},
        customer_relationships = ${version[0].customer_relationships},
        customer_segments = ${version[0].customer_segments},
        key_resources = ${version[0].key_resources},
        channels = ${version[0].channels},
        cost_structure = ${version[0].cost_structure},
        revenue_streams = ${version[0].revenue_streams},
        updated_at = NOW()
      WHERE id = ${canvasId}
      RETURNING *
    ` as any[]
    return result[0]
  } catch (error) {
    console.error('Error restoring version:', error)
    throw error
  }
}

// Generate share link
export async function generateShareLink(canvasId: string) {
  try {
    const result = await sql`
      UPDATE business_model_canvas 
      SET share_token = ${crypto.randomUUID()}
      WHERE id = ${canvasId}
      RETURNING share_token
    ` as any[]
    return result[0]?.share_token
  } catch (error) {
    console.error('Error generating share link:', error)
    throw error
  }
}

// Get canvas by share token (public access)
export async function getCanvasByShareToken(token: string) {
  try {
    const result = await sql`
      SELECT * FROM business_model_canvas 
      WHERE share_token = ${token}
      LIMIT 1
    ` as any[]
    return result[0] || null
  } catch (error) {
    console.error('Error fetching canvas by share token:', error)
    return null
  }
}

// Create or update user
export async function createOrUpdateUser(userData: { id: string; email: string; name?: string }) {
  try {
    const result = await sql`
      INSERT INTO users (id, email, name)
      VALUES (${userData.id}, ${userData.email}, ${userData.name || ''})
      ON CONFLICT (id) 
      DO UPDATE SET 
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = NOW()
      RETURNING *
    ` as any[]
    return result[0]
  } catch (error) {
    console.error('Error creating/updating user:', error)
    throw error
  }
}
