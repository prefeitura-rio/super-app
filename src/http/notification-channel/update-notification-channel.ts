'use server'

import { api } from '@/lib/api'
import type { NotificationChannel } from '@/models/entities'

export async function updateNotificationChannel(id: string, name: string) {
  const response = await api.put<NotificationChannel>(
    `/notification-channels/${id}`,
    {
      name,
    },
  )

  return response.data
}
