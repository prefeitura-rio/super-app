import { z } from 'zod'

const envSchema = z.object({
  VISION_AI_API_URL: z.string().url().min(1),
  GATEWAY_API_URL: z.string().url().min(1),
  CIVITAS_API_URL: z.string().url().min(1),
  MAPBOX_ACCESS_TOKEN: z.string().min(1),
  DISCORD_WEBHOOK_ID: z.string().min(1),
  DISCORD_WEBHOOK_TOKEN: z.string().min(1),
})

const _env = envSchema.safeParse({
  VISION_AI_API_URL: process.env.VISION_AI_API_URL,
  GATEWAY_API_URL: process.env.GATEWAY_API_URL,
  CIVITAS_API_URL: process.env.CIVITAS_API_URL,
  MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
  DISCORD_WEBHOOK_ID: process.env.DISCORD_WEBHOOK_ID,
  DISCORD_WEBHOOK_TOKEN: process.env.DISCORD_WEBHOOK_TOKEN,
})

if (_env.success === false) {
  console.error('❌ Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables!')
}

export const env = _env.data
