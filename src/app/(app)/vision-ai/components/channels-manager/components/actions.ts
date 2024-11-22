'use server'

import { api } from '@/lib/api'

export async function addChannel(name: string) {
  const response = await api.post('/notification-channels', {
    name,
  })

  return response.data
}

export async function editChannel(id: string, name: string) {
  const response = await api.put(`/notification-channels/${id}`, {
    name,
  })

  return response.data
}

export async function deleteChannel(id: string) {
  const response = await api.delete(`/notification-channels/${id}`)

  return response.data
}
