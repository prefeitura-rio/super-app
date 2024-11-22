'use client'

import { useQuery } from '@tanstack/react-query'

import { getModels } from '@/http/models/get-model'
import { queryClient } from '@/lib/react-query'

export function useModels() {
  return useQuery(
    {
      queryKey: ['models'],
      queryFn: getModels,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
    queryClient,
  )
}
