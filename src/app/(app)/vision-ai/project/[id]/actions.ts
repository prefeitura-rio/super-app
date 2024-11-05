'use server'

import { redirect } from 'next/navigation'

import { env } from '@/env'

interface UpdateProject {
  id: string
  name: string
  model: string
  model_config: {
    yolo_default_precision: number
    yolo_send_message?: boolean
    yolo_crowd_count?: number
  }
  cameras_id: string[]
  time_start?: string
  time_end?: string
  discord_webhook_id: string
  discord_webhook_token: string
  enable: boolean
}

export async function updateProjectAction(props: UpdateProject) {
  await fetch(`${env.VISION_AI_API_URL}/project/${props.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: props.name,
      model: props.model,
      model_config: props.model_config,
      cameras_id: props.cameras_id,
      time_start: props.time_start,
      time_end: props.time_end,
      discord_webhook_id: props.discord_webhook_id,
      discord_webhook_token: props.discord_webhook_token,
      enable: props.enable,
    }),
  })

  redirect('/vision-ai')
}
