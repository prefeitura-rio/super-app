import { z } from 'zod'

export const projectFormSchema = z.object({
  name: z.string().min(1, { message: 'O nome do projeto é obrigatório.' }),
  description: z.string().optional(),
  model: z.string().min(1),
  enabled: z.boolean(),
  notificationChannel: z.string().min(1),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
})

export type ProjectForm = z.infer<typeof projectFormSchema>
