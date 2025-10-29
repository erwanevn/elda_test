import { pool } from '../db.ts'
import type { SnowCannonQuery } from '../schemas/snowCannon.schema.ts'

export type CANNON_TYPES = 'lance' | 'autonome' | 'tour'

export interface SnowCannon {
	id: number
	numero_regard: number
	secteur: number
	type: CANNON_TYPES
	nom_piste: string
	latitude: number
	longitude: number
	created_at: Date
	updated_at: Date
}

export interface LatestMeasurement {
	id: number
	conso_eau_m3: number
	objectif_mini_m3: number
	objectif_max_m3: number
	duree_fonctionnement_h: number
	date_mesure: string
}

export const SnowCannonModel = {
	async findAll(filters: SnowCannonQuery = {}) {
		const whereClauses: string[] = []
		const values: any[] = []

		// sector filter
		if (typeof filters.secteur !== 'undefined') {
			values.push(filters.secteur)
			whereClauses.push(`sc.secteur = $${values.length}`)
		}

		// type filter
		if (typeof filters.type !== 'undefined') {
			values.push(filters.type)
			whereClauses.push(`sc.type = $${values.length}`)
		}

		// min consumption filter
		if (typeof filters.minConsumption !== 'undefined') {
			values.push(filters.minConsumption)
			whereClauses.push(`scm.conso_eau_m3 >= $${values.length}`)
		}

		// max consumption filter
		if (typeof filters.maxConsumption !== 'undefined') {
			values.push(filters.maxConsumption)
			whereClauses.push(`scm.conso_eau_m3 <= $${values.length}`)
		}

		const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

		const query = `
			SELECT
			sc.*,
			json_build_object(
				'id', scm.id,
				'conso_eau_m3', scm.conso_eau_m3,
				'objectif_mini_m3', scm.objectif_mini_m3,
				'objectif_max_m3', scm.objectif_max_m3,
				'duree_fonctionnement_h', scm.duree_fonctionnement_h,
				'date_mesure', scm.date_mesure
			) AS latest_measurement
			FROM snow_cannons sc
			LEFT JOIN LATERAL (
			SELECT *
			FROM snow_cannon_measurements m
			WHERE m.snow_cannon_id = sc.id
			ORDER BY m.created_at DESC
			LIMIT 1
			) scm ON TRUE
			${whereSql}
			ORDER BY sc.id ASC;
		`

		const { rows } = await pool.query(query, values)

		return rows
	},

	async findOneById(id: number) {
		const { rows } = await pool.query(
			`
			SELECT
			sc.*,
			json_build_object(
				'id', scm.id,
				'conso_eau_m3', scm.conso_eau_m3,
				'objectif_mini_m3', scm.objectif_mini_m3,
				'objectif_max_m3', scm.objectif_max_m3,
				'duree_fonctionnement_h', scm.duree_fonctionnement_h,
				'date_mesure', scm.date_mesure
			) AS latest_measurement
			FROM snow_cannons sc
			LEFT JOIN LATERAL (
			SELECT *
			FROM snow_cannon_measurements m
			WHERE m.snow_cannon_id = sc.id
			ORDER BY m.created_at DESC
			LIMIT 1
			) scm ON TRUE
			WHERE sc.id = $1;
			`,
			[id]
		)

		return rows[0] || null
	},
}
