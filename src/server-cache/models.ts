'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'
import type { Model } from '@/models/entities'

export async function getModelsAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const response = await fetch(`${env.VISION_AI_API_URL}/model`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.ok === false) {
    console.error({ response })
    return []
  }
  const models: Model[] = await response.json()

  return models
}
