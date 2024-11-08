'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'
import type { Model, RawModel } from '@/models/entities'

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
  const rawModels: RawModel[] = await response.json()

  const models: Model[] = rawModels.map((rawModel) => ({
    name: rawModel.model,
    description: rawModel.description,
  }))

  return models
}
