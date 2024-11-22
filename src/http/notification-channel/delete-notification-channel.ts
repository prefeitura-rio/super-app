'use server'

import { api } from '@/lib/api'
import type { ApiResponseDetail } from '@/models/entities'

export async function deleteNotificationChannel(id: string) {
  const response = await api.delete<ApiResponseDetail>(
    `/notification-channels/${id}`,
  )

  return response.data
}
