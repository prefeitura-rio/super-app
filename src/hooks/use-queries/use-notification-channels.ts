'use client'

import { useQuery } from '@tanstack/react-query'

import { getNotificationChannels } from '@/http/notification-channel/get-notification-channels'
import { queryClient } from '@/lib/react-query'

export function useNotificationChannels() {
  return useQuery(
    {
      queryKey: ['notification-channels'],
      queryFn: getNotificationChannels,
    },
    queryClient,
  )
}
