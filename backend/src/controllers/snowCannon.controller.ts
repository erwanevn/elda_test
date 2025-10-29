import type { Request, Response } from 'express'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

import { SnowCannonModel } from '../models/snowCannon.model.ts'
import type { LatestMeasurement, SnowCannon } from '../models/snowCannon.model.ts'
import { idParamSchema } from '../schemas/common.schemas.ts'
import { snowCannonQuerySchema } from '../schemas/snowCannon.schema.ts'

// GEOJSON TYPES
interface GeoJSONFeature {
	type: 'Feature'
	geometry: {
		type: 'Point' | string
		coordinates: [number, number] | number[]
	}
	properties: Record<string, any>
}

interface GeoJSONFeatureCollection {
	type: 'FeatureCollection'
	features: GeoJSONFeature[]
}

export const SnowCannonController = {
	// Get all snow cannons
	async getAll(req: Request, res: Response) {
		const parsed = snowCannonQuerySchema.safeParse(req.query)

		if (!parsed.success) {
			return res.status(400).json({
				error: 'Invalid query parameters',
				details: parsed.error.issues,
			})
		}

		const filters = parsed.data

		const cannons = await SnowCannonModel.findAll(filters)

		res.json(cannons)
	},

	// Get snow cannon by id
	async getOneById(req: Request, res: Response) {
		const parseResult = idParamSchema.safeParse(req.params)

		if (!parseResult.success) {
			return res.status(400).json({
				error: 'Invalid request params',
				issues: parseResult.error.issues,
			})
		}

		const { id } = parseResult.data

		const cannon = await SnowCannonModel.findOneById(id)

		if (!cannon) {
			return res.status(404).json({ error: 'Snow cannon not found' })
		}

		res.json(cannon)
	},

	// Get full geojson with snow cannon values
	async getGeojson(req: Request, res: Response) {
		const cannons = await SnowCannonModel.findAll()

		const __filename = fileURLToPath(import.meta.url)
		const __dirname = dirname(__filename)

		const geojsonPath = join(__dirname, `../../geojsons/avoriaz_cannons.json`)

		const raw = readFileSync(geojsonPath, 'utf-8')
		const featureCollection: GeoJSONFeatureCollection = JSON.parse(raw)

		const enrichedFeatures = featureCollection.features.map(feature => {
			const cannon: SnowCannon & { latest_measurement: LatestMeasurement } = cannons.find(
				c => c.id === feature.properties.id
			)

			//TODO: no cannon found, return http error ?
			if (!cannon) {
				return feature
			}

			const mergedProps = {
				...feature.properties,
				conso_eau_m3: cannon.latest_measurement.conso_eau_m3,
				objectif_max_m3: cannon.latest_measurement.objectif_max_m3,
				percent_of_max: Math.round(
					(cannon.latest_measurement.conso_eau_m3 / cannon.latest_measurement.objectif_max_m3) * 100
				),
			}

			return {
				...feature,
				properties: mergedProps,
			}
		})

		const enrichedCollection: GeoJSONFeatureCollection = {
			...featureCollection,
			features: enrichedFeatures,
		}

		res.json(enrichedCollection)
	},
}
