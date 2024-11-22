'use server'

import { api } from '@/lib/api'
import type { NotificationChannel } from '@/models/entities'

export async function getNotificationChannels() {
  const response = await api.get<NotificationChannel[]>(
    '/notification-channels',
  )

  return response.data
}
