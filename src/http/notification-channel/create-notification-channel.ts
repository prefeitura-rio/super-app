'use server'

import { api } from '@/lib/api'
import type { NotificationChannel } from '@/models/entities'

export async function createNotificationChannel(name: string) {
  const response = await api.post<NotificationChannel>(
    '/notification-channels',
    {
      name,
    },
  )

  return response.data
}
