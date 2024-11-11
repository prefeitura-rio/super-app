'use server'

import {} from 'date-fns'
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

  const utcTodayWithTimeStr = `${today.toISOString().split('T')[0]}T${time}`

  const newDate = new Date(utcTodayWithTimeStr)

  return newDate
}
