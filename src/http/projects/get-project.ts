'use server'

import { api } from '@/lib/api'
import type { Project } from '@/models/entities'

export async function getProject(id: string) {
  const response = await api.get<Project>(`/project/${id}`)
  return response.data
}
