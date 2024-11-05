import { z } from 'zod'

export const projectFormSchema = z.object({
  name: z.string().min(1, { message: 'O nome do projeto é obrigatório.' }),
  model: z.string().min(1),
  enabled: z.boolean(),
  notificationChannel: z.string().min(1),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  yolo_default_precision: z
    .number({ message: 'Obrigatório' })
    .min(0, { message: 'Deve ser entre 0 e 1' })
    .max(1, { message: 'Deve ser entre 0 e 1' }),
  yolo_send_message: z.boolean().optional(),
  yolo_crowd_count: z.number().optional(), // specific to CROWD model
})

export type ProjectForm = z.infer<typeof projectFormSchema>
