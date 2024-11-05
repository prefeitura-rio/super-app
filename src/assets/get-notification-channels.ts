'use server'

import { env } from '@/env'

export async function getNotificationChannels() {
  return [
    {
      id: env.DISCORD_WEBHOOK_ID,
      token: env.DISCORD_WEBHOOK_TOKEN,
      name: 'aglomeração-1',
    },
  ]
}
