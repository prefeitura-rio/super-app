'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'
import type { NotificationChannel } from '@/models/entities'

export async function getNotificationChannels() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const response = await fetch(
    `${env.VISION_AI_API_URL}/notification-channels`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (response.ok === false) {
    console.error({ response })
    return []
  }
  const channels: NotificationChannel[] = await response.json()

  return channels
}
