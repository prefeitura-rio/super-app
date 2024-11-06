'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'
import type { Project, RawProject } from '@/models/entities'

export async function getProjectsAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const data = await fetch(`${env.VISION_AI_API_URL}/project`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const rawProjects: RawProject[] = await data.json()

  // Improve attribute names and structure
  const projects: Project[] = rawProjects.map((rawProject) => ({
    id: rawProject.id,
    name: rawProject.name,
    description: rawProject.model,
    model: rawProject.model,
    camera_ids: rawProject.cameras_id,
    model_config: rawProject.model_config,
    discord_webhook_id: rawProject.discord_webhook_id,
    discord_webhook_token: rawProject.discord_webhook_token,
    start_time: rawProject.time_start,
    end_time: rawProject.time_end,
    enabled: rawProject.enable,
  }))

  return projects
}
