'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'
import type { Project } from '@/models/entities'

export async function getProjectsAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const response = await fetch(`${env.VISION_AI_API_URL}/project`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.ok === false) {
    console.error({ response })
    return []
  }

  const projects: Project[] = await response.json()
  console.log({ projects })

  return projects
}
