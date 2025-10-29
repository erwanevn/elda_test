import { Router } from 'express'
import { SnowCannonController } from '../controllers/snowCannon.controller.ts'

const router = Router()

router.get('/', SnowCannonController.getAll)
router.get('/geojson', SnowCannonController.getGeojson)
router.get('/:id', SnowCannonController.getOneById)

export default router
