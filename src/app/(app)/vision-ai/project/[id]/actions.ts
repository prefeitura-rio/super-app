'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { env } from '@/env'

interface UpdateProject {
  id: string
  name: string
  model: string
  model_config: {
    yolo_default_precision?: number
    yolo_send_message?: boolean
    yolo_crowd_count?: number
  }
  cameras_id: string[]
  time_start?: string
  time_end?: string
  discord_id: string
  enable: boolean
}

export async function updateProjectAction(props: UpdateProject) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  await fetch(`${env.VISION_AI_API_URL}/project/${props.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: props.name,
      model: props.model,
      model_config: props.model_config,
      cameras_id: props.cameras_id,
      time_start: props.time_start,
      time_end: props.time_end,
      discord_id: props.discord_id,
      enable: props.enable,
    }),
  })

  redirect('/vision-ai')
}

export async function formatCurrentDateTime(time: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const splited = time.split(':')

  const hour = parseInt(splited[0]) - 3 // Converte para o horário de Brasília
  const minute = parseInt(splited[1])

  today.setHours(hour, minute)
  return today
}
