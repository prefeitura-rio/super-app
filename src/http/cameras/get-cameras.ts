'use server'

import { api } from '@/lib/api'
import type { Camera, RawCamera } from '@/models/entities'

export async function getCameras() {
  const response = await api.get<RawCamera[]>('/camera')

  const cameras: Camera[] = response.data.map((camera) => ({
    id: camera.CameraCode,
    name: camera.CameraName,
    zone: camera.CameraZone,
    latitude: Number(camera.Latitude),
    longitude: Number(camera.Longitude),
    streamingUrl: camera.Streamming,
  }))

  return cameras
}
