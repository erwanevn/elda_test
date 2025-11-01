import 'mapbox-gl/dist/mapbox-gl.css'
import Map from 'react-map-gl/mapbox'
import mapboxgl from 'mapbox-gl'

import { mapConfig } from './config/mapConfig'
import { useMap } from './hooks/useMap'
import { useMapStore } from './stores/useMapStore'
import Panel from './components/panels/Panel'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN as string

// Map bounds
const BOUNDS: [[number, number], [number, number]] = [
	[mapConfig.bounds.west, mapConfig.bounds.south],
	[mapConfig.bounds.east, mapConfig.bounds.north],
]

const App = () => {
	// Stores
	const { loadSnowCannons, setSelectedId, selectedId } = useMapStore()

	// Hooks
	const {
		mapRef,
		setMapInstance,
		addSourceOnce,
		addLayerOnce,
		onLayerClick,
		onMapClickOutsideLayer,
		setCursorOnHover,
		setBounds,
	} = useMap()

	const handleLoad = async (e: any) => {
		setMapInstance(e.target)
		setBounds(BOUNDS, 20)

		// Data
		const data = await loadSnowCannons()

		if (!data) return

		// Cannons source
		addSourceOnce('snowCannons', { type: 'geojson', data })

		// Cannons circles
		addLayerOnce({
			id: 'snowCannons-layer',
			type: 'circle',
			source: 'snowCannons',
			filter: ['!', ['has', 'point_count']], // TODO: clustering
			paint: {
				'circle-radius': 8,
				'circle-color': [
					'case',
					['==', ['get', 'percent_of_max'], 0],
					'#cccccc',
					['<', ['get', 'percent_of_max'], 34],
					'#2ecc71',
					['<', ['get', 'percent_of_max'], 67],
					'#f1c40f',
					['<', ['get', 'percent_of_max'], 100],
					'#e67e22',
					'#e74c3c',
				],
				'circle-stroke-color': '#ffffff',
				'circle-stroke-width': 3,
				'circle-opacity': 0.8,
			},
		})

		// Cannons shadows
		addLayerOnce(
			{
				id: 'snowCannons-shadows',
				type: 'circle',
				source: 'snowCannons',
				paint: {
					'circle-radius': 15,
					'circle-color': '#000',
					'circle-blur': 1,
					'circle-opacity': 0.3,
				},
			},
			'snowCannons-layer'
		)

		// Events
		const offClick = onLayerClick('snowCannons-layer', f => {
			setSelectedId(String(f.properties?.id ?? ''))
			console.log('Click on cannon id:', f.properties?.id)
		})

		const offOutside = onMapClickOutsideLayer('snowCannons-layer', () => {
			setSelectedId(null)
			console.log('Clicked outside')
		})

		const offCursor = setCursorOnHover('snowCannons-layer')

		// Cleanup
		e.target.once('remove', () => {
			offClick?.()
			offOutside?.()
			offCursor?.()
		})
	}

	return (
		<div className="h-screen w-full">
			<div className="absolute border-20 h-full w-full">
				<Panel />
			</div>
			<Map
				ref={mapRef as any}
				onLoad={handleLoad}
				mapboxAccessToken={mapboxgl.accessToken as string}
				initialViewState={{
					latitude: mapConfig.center.latitude,
					longitude: mapConfig.center.longitude,
					zoom: mapConfig.zoom.initial,
				}}
				minZoom={mapConfig.zoom.min}
				maxZoom={mapConfig.zoom.max}
				maxBounds={BOUNDS}
				dragPan={true}
				mapStyle="mapbox://styles/mapbox/dark-v11"
			/>
		</div>
	)
}

export default App
