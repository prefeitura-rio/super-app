'use server'

import { api } from '@/lib/api'
import type { Project } from '@/models/entities'

export interface UpdateProjectProps {
  id: string
  name: string
  model: string
  model_config: {
    yolo_default_precision?: number
    yolo_send_message?: boolean
    yolo_crowd_count?: number
  }
  cameras_id: string[]
  time_start?: string | null
  time_end?: string | null
  discord_id: string
  enable: boolean
}

export async function updateProject(props: UpdateProjectProps) {
  const response = await api.put<Project>(`/project/${props.id}`, props)

  return response.data
}
