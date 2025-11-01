import { create } from 'zustand'

type CannonsState = {
	loading: boolean
	error: string | null
	cannons: any | null
	loadCannons: () => Promise<GeoJSON.FeatureCollection | null>
}

export const useCannonsStore = create<CannonsState>((set, get) => ({
	loading: false,
	error: null,

	cannons: null,
	loadCannons: async () => {
		set({ loading: true, error: null })

		try {
			const res = await fetch('http://localhost:3001/snowCannons')
			const data = await res.json()

			set({ loading: false, cannons: data })

			return data
		} catch (e: any) {
			set({ loading: false, error: e?.message ?? 'fetch error' })

			return null
		}
	},
}))
