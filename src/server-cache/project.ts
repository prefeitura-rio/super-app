'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'
import type { Project, RawProject } from '@/models/entities'

export async function getProjectAction(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const data = await fetch(`${env.VISION_AI_API_URL}/project/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (data.ok === false) {
    console.error({ data })
    throw new Error('Failed to fetch projects')
  }

  const rawProject: RawProject = await data.json()

  const project: Project = {
    id: rawProject.id,
    name: rawProject.name,
    model: rawProject.model,
    camera_ids: rawProject.cameras_id,
    model_config: rawProject.model_config,
    discord_webhook_id: rawProject.discord_webhook_id,
    discord_webhook_token: rawProject.discord_webhook_token,
    start_time: rawProject.time_start,
    end_time: rawProject.time_end,
    enabled: rawProject.enable,
  }

  return project
}
