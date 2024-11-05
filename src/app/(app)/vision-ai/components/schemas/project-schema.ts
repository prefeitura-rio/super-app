import { z } from 'zod'

export const projectFormSchema = z.object({
  name: z.string().min(1, { message: 'O nome do projeto é obrigatório.' }),
  description: z.string().optional(),
  model: z.string().min(1),
  enabled: z.boolean(),
  notificationChannel: z.object({
    name: z.string().min(1),
    id: z.string().min(1),
    token: z.string().min(1),
  }),
})

export type ProjectForm = z.infer<typeof projectFormSchema>
