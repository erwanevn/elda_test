import { Router } from 'express'

import snowCannonRouter from './snowCannon.ts'

const router = Router()

router.use('/snowCannons', snowCannonRouter)

export default router
