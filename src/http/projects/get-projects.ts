'use server'

import { api } from '@/lib/api'
import type { Project } from '@/models/entities'

export async function getProjects() {
  const response = await api.get<Project[]>('/project')

  return response.data
}
