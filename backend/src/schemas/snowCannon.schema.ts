import { z } from 'zod'
import type { CANNON_TYPES } from '../models/snowCannon.model.ts'

const numericQueryParam = z
	.string()
	.regex(/^\d+(\.\d+)?$/, 'numeric')
	.transform(val => Number(val))

export const snowCannonQuerySchema = z.object({
	secteur: z.string().regex(/^\d+$/).transform(Number).optional(),
	type: z
		.string()
		.refine((val): val is CANNON_TYPES => ['lance', 'autonome', 'tour'].includes(val), {
			message: 'Invalid cannon type',
		})
		.optional(),
	minConsumption: numericQueryParam.optional(),
	maxConsumption: numericQueryParam.optional(),
})

export type SnowCannonQuery = z.infer<typeof snowCannonQuerySchema>
