import { create } from 'zustand'
import type { FeatureCollection, Feature } from 'geojson'

type BBox = [[number, number], [number, number]]

type MapState = {
	map: mapboxgl.Map | null
	setMap: (m: any) => void
	whenReady: (cb: (map: mapboxgl.Map) => void) => void
	_queue: Array<(map: mapboxgl.Map) => void>

	selectedId: string | null
	loading: boolean
	error: string | null
	filters: { minPercent?: number }
	setSelectedId: (id: string | null) => void
	setFilters: (f: Partial<MapState['filters']>) => void
	loadSnowCannons: () => Promise<GeoJSON.FeatureCollection | null>
	addSourceOnce: (id: string, source: mapboxgl.SourceSpecification) => void
	addLayerOnce: (layer: mapboxgl.Layer, beforeId?: string) => void
	onLayerClick: (
		layerId: string,
		handler: (f: mapboxgl.GeoJSONFeature, e: mapboxgl.MapMouseEvent & mapboxgl.MapDataEvent) => void
	) => () => void
	onMapClickOutsideLayer: (
		layerId: string,
		handler: (e: mapboxgl.MapMouseEvent & mapboxgl.MapDataEvent) => void
	) => () => void
	setBounds: (bounds: BBox, padding?: number) => void
	setCursorOnHover: (layerId: string) => () => void
	setGeoJSONData: (sourceId: string, data: FeatureCollection | Feature) => void
	focusOnPoint: (point: [number, number], zoom?: number) => void
}

export const useMapStore = create<MapState>((set, get) => ({
	map: null,
	_queue: [],
	setMap: (m: any) => {
		const map = m?.getMap?.() ?? m

		if (!map) return

		set({ map })

		// Stack cb until map is init
		const q = get()._queue
		if (q.length) {
			q.forEach(cb => cb(map))
			set({ _queue: [] })
		}
	},
	whenReady: cb => {
		const map = get().map
		map ? cb(map) : set(s => ({ _queue: [...s._queue, cb] }))
	},

	selectedId: null,
	setSelectedId: (id: string | null) => {
		const map = get().map
		const prev = get().selectedId
		set({ selectedId: id })

		if (!map || !map.getSource('snowCannons')) return

		if (prev != null) {
			map.setFeatureState({ source: 'snowCannons', id: prev }, { selected: false })
		}
		if (id != null) {
			map.setFeatureState({ source: 'snowCannons', id }, { selected: true })
		}
	},

	addSourceOnce: (id, source) => {
		const map = get().map
		if (!map) return
		if (!map.getSource(id)) map.addSource(id, source)
	},

	addLayerOnce: (layer, beforeId) => {
		const map = get().map
		if (!map) return
		if (!map.getLayer(layer.id)) map.addLayer(layer, beforeId)
	},

	onLayerClick: (layerId, handler) => {
		const map = get().map
		if (!map) return () => {}
		const listener = (e: any) => {
			const f = e.features?.[0]
			if (f) handler(f, e)
		}
		map.on('click', layerId, listener)
		return () => map.off('click', layerId, listener)
	},

	onMapClickOutsideLayer: (layerId, handler) => {
		const map = get().map
		if (!map) return () => {}
		const listener = (e: any) => {
			const hits = map.queryRenderedFeatures(e.point, { layers: [layerId] })
			if (hits.length === 0) handler(e)
		}
		map.on('click', listener)
		return () => map.off('click', listener)
	},

	setBounds: (bounds, padding = 20) => {
		const map = get().map
		if (!map) return
		map.setMaxBounds(bounds)
		map.fitBounds(bounds, { padding, duration: 800 })
	},

	setCursorOnHover: layerId => {
		const map = get().map
		if (!map) return () => {}
		const enter = () => {
			map.getCanvas().style.cursor = 'pointer'
		}
		const leave = () => {
			map.getCanvas().style.cursor = ''
		}
		map.on('mouseenter', layerId, enter)
		map.on('mouseleave', layerId, leave)
		return () => {
			map.off('mouseenter', layerId, enter)
			map.off('mouseleave', layerId, leave)
		}
	},

	setGeoJSONData: (sourceId, data) => {
		const map = get().map
		if (!map) return
		const src = map.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined
		if (src) src.setData(data as any)
	},

	focusOnPoint: (point, zoom = 13) => {
		const map = get().map
		if (!map) return
		map.easeTo({ center: point, zoom })
	},

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
