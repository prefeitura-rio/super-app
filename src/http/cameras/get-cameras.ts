'use server'

import { api } from '@/lib/api'
import type { Camera } from '@/models/entities'

export async function getCameras() {
  const response = await api.get<Camera[]>('/camera')

  return response.data
}
