'use server'

import { api } from '@/lib/api'
import { Model } from '@/models/entities'

export async function getModels() {
  const response = await api.get<Model[]>('/model')

  return response.data
}
