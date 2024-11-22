'use client'

import { useQuery } from '@tanstack/react-query'

import { getCameras } from '@/http/cameras/get-cameras'
import { queryClient } from '@/lib/react-query'

export function useCameras() {
  return useQuery(
    {
      queryKey: ['cameras'],
      queryFn: getCameras,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
    queryClient,
  )
}
