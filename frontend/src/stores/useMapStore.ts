import { create } from 'zustand'

type MapState = {
	selectedId: string | null
	loading: boolean
	error: string | null
	filters: { minPercent?: number }
	setSelectedId: (id: string | null) => void
	setFilters: (f: Partial<MapState['filters']>) => void
	loadSnowCannons: () => Promise<GeoJSON.FeatureCollection | null>
}

export const useMapStore = create<MapState>((set, get) => ({
	selectedId: null,
	setSelectedId: selectedId => set({ selectedId }),

	loading: false,
	error: null,

	filters: {},
	setFilters: f => set({ filters: { ...get().filters, ...f } }),

	loadSnowCannons: async () => {
		set({ loading: true, error: null })

		try {
			const res = await fetch('http://localhost:3001/snowCannons/geojson')
			const data = (await res.json()) as GeoJSON.FeatureCollection

			set({ loading: false })

			return data
		} catch (e: any) {
			set({ loading: false, error: e?.message ?? 'fetch error' })

			return null
		}
	},
}))
