import { z } from 'zod'

export const idParamSchema = z.object({
	id: z.string().regex(/^\d+$/, 'ID must be numeric').transform(Number),
})

export type IdParam = z.infer<typeof idParamSchema>
