'use client'

import { useQuery } from '@tanstack/react-query'

import { getProjects } from '@/http/projects/get-projects'
import { queryClient } from '@/lib/react-query'

export function useProjects() {
  return useQuery(
    {
      queryKey: ['projects'],
      queryFn: getProjects,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
    queryClient,
  )
}
