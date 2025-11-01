import { useCallback, useRef } from 'react'

type BBox = [[number, number], [number, number]]

export function useMap() {
	const mapRef = useRef<mapboxgl.Map | null>(null)

	const setMapInstance = useCallback((m: any) => {
		const map = m?.getMap?.() ?? m

		if (map) mapRef.current = map
	}, [])

	const addSourceOnce = useCallback((id: string, source: mapboxgl.SourceSpecification) => {
		const map = mapRef.current

		if (!map) return

		if (!map.getSource(id)) map.addSource(id, source)
	}, [])

	const addLayerOnce = useCallback((layer: mapboxgl.Layer, beforeId?: string) => {
		const map = mapRef.current

		if (!map) return

		if (!map.getLayer(layer.id)) map.addLayer(layer, beforeId)
	}, [])

	const onLayerClick = useCallback(
		(
			layerId: string,
			handler: (f: mapboxgl.GeoJSONFeature, e: mapboxgl.MapMouseEvent & mapboxgl.MapDataEvent) => void
		) => {
			const map = mapRef.current

			if (!map) return () => {}

			const listener = (e: any) => {
				const f = e.features?.[0]
				if (f) handler(f, e)
			}

			map.on('click', layerId, listener)

			return () => map.off('click', layerId, listener)
		},
		[]
	)

	const onMapClickOutsideLayer = useCallback(
		(layerId: string, handler: (e: mapboxgl.MapMouseEvent & mapboxgl.MapDataEvent) => void) => {
			const map = mapRef.current

			if (!map) return () => {}

			const listener = (e: any) => {
				const hits = map.queryRenderedFeatures(e.point, { layers: [layerId] })
				if (hits.length === 0) handler(e)
			}

			map.on('click', listener)

			return () => map.off('click', listener)
		},
		[]
	)

	const setBounds = useCallback((bounds: BBox, padding = 20) => {
		const map = mapRef.current

		console.log(map)
		if (!map) return

		map.setMaxBounds(bounds)
		map.fitBounds(bounds, { padding, duration: 800 })
	}, [])

	const setCursorOnHover = useCallback((layerId: string) => {
		const map = mapRef.current

		if (!map) return () => {}

		const enter = () => (map.getCanvas().style.cursor = 'pointer')
		const leave = () => (map.getCanvas().style.cursor = '')

		map.on('mouseenter', layerId, enter)
		map.on('mouseleave', layerId, leave)

		return () => {
			map.off('mouseenter', layerId, enter)
			map.off('mouseleave', layerId, leave)
		}
	}, [])

	const setGeoJSONData = useCallback((sourceId: string, data: GeoJSON.FeatureCollection) => {
		const map = mapRef.current

		if (!map) return

		const src = map.getSource(sourceId) as mapboxgl.GeoJSONSource

		if (src) src.setData(data as any)
	}, [])

	const focusOnPoint = useCallback(
		(point: [number, number]) => {
			const map = mapRef.current

			console.log(map)
			if (!map) return () => {}

			map.easeTo({ center: point, zoom: 13 })
		},
		[mapRef.current]
	)

	return {
		mapRef,
		setMapInstance,
		addSourceOnce,
		addLayerOnce,
		onLayerClick,
		onMapClickOutsideLayer,
		setCursorOnHover,
		setBounds,
		setGeoJSONData,
		focusOnPoint,
	}
}
