'use client'

import { useQuery } from '@tanstack/react-query'

import { getProject } from '@/http/projects/get-project'
import { queryClient } from '@/lib/react-query'

export function useProject(id: string) {
  return useQuery(
    {
      queryKey: ['project', id],
      queryFn: () => getProject(id),
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
    queryClient,
  )
}
