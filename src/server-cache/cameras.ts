'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'
import type { Camera, RawCamera } from '@/models/entities'

export async function getCamerasAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const response = await fetch(`${env.VISION_AI_API_URL}/camera`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.ok === false) {
    console.error({ response })
    return []
  }

  const rawCameras: RawCamera[] = await response.json()

  const cameras: Camera[] = rawCameras.map((rawCamera) => ({
    id: rawCamera.CameraCode,
    name: rawCamera.CameraName,
    zone: rawCamera.CameraZone,
    latitude: Number(rawCamera.Latitude),
    longitude: Number(rawCamera.Longitude),
    streamingUrl: rawCamera.Streamming,
  }))

  return cameras
}
