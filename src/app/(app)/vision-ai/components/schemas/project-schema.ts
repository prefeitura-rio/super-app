import { z } from 'zod'

export const projectFormSchema = z
  .object({
    name: z.string().min(1, { message: 'O nome do projeto é obrigatório.' }),
    model: z.string().min(1, { message: 'O modelo é obrigatório.' }),
    enabled: z.boolean(),
    notificationChannelId: z
      .string()
      .min(1, { message: 'O canal é obrigatório.' }),
    startTime: z.date().optional(),
    endTime: z.date().optional(),
    yolo_default_precision: z.coerce
      .number({ message: 'A precisão é obrigatória' })
      .min(0, { message: 'Deve ser entre 0 e 1' })
      .max(1, { message: 'Deve ser entre 0 e 1' }),
    yolo_send_message: z.boolean().optional(),
    yolo_crowd_count: z
      .string()
      .optional()
      .refine((val) => val === undefined || val === '' || !isNaN(Number(val)), {
        message: 'Deve ser um número',
      })
      .transform((val) =>
        val === '' || val === undefined ? undefined : Number(val),
      ),
  })
  .superRefine((val, ctx) => {
    // Access the entire parsed object to get `model`
    if (val.model === 'CROWD' && val.yolo_crowd_count === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Obrigatório',
        path: ['yolo_crowd_count'],
      })
    }
  })

export type ProjectForm = z.infer<typeof projectFormSchema>
