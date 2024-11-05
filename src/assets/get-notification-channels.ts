'use server'

import { env } from '@/env'

export async function getNotificationChannels() {
  console.log('getNotificationChannels')
  console.log({ env })
  return [
    {
      id: env.DISCORD_WEBHOOK_ID,
      token: env.DISCORD_WEBHOOK_TOKEN,
      name: 'aglomeração-1',
    },
  ]
}
