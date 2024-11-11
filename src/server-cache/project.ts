'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'
import type { Project } from '@/models/entities'

export async function getProjectAction(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const response = await fetch(`${env.VISION_AI_API_URL}/project/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.ok === false) {
    console.error({ response })
    throw new Error('Failed to fetch project')
  }

  const project: Project = await response.json()
  console.log({ project })

  return project
}
