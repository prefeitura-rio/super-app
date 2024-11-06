'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'
import type { Project } from '@/models/entities'

interface CreateProject {
  name: string
  model: string
  model_config: {
    yolo_crowd_count?: number // CROWD
    yolo_default_precision: number
    yolo_discord_webhook_id?: string
    yolo_discord_webhook_token?: string
    yolo_send_message?: boolean
  }
  cameras_id: string[]
  time_start?: string
  time_end?: string
  discord_webhook_id: string
  discord_webhook_token: string
}

export async function createProjectAction(props: CreateProject) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const response = await fetch(`${env.VISION_AI_API_URL}/project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: props.name,
      model: props.model,
      model_config: props.model_config,
      cameras_id: props.cameras_id,
      time_start: props.time_start,
      time_end: props.time_end,
      discord_webhook_id: props.discord_webhook_id,
      discord_webhook_token: props.discord_webhook_token,
    }),
  })

  if (response.ok) {
    const project: Project = await response.json()

    return project
  } else {
    const error = await response.json()
    throw error
  }
}
