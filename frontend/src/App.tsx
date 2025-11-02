// App.tsx
import 'mapbox-gl/dist/mapbox-gl.css'
import Map, { Popup } from 'react-map-gl/mapbox'
import mapboxgl from 'mapbox-gl'

import { mapConfig } from './config/mapConfig'
import { useMapStore } from './stores/useMapStore'
import Panel from './components/panels/Panel'
import { useEffect, useMemo } from 'react'
import CannonPopup from './components/modals/CannonPopup'
import { useCannonsStore } from './stores/useCannonsStore'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN as string

// Map bounds
const BOUNDS: [[number, number], [number, number]] = [
	[mapConfig.bounds.west, mapConfig.bounds.south],
	[mapConfig.bounds.east, mapConfig.bounds.north],
]

const App = () => {
	// Map store
	const setMap = useMapStore(s => s.setMap)
	const whenReady = useMapStore(s => s.whenReady)
	const addSourceOnce = useMapStore(s => s.addSourceOnce)
	const addLayerOnce = useMapStore(s => s.addLayerOnce)
	const onLayerClick = useMapStore(s => s.onLayerClick)
	const onMapClickOutsideLayer = useMapStore(s => s.onMapClickOutsideLayer)
	const setCursorOnHover = useMapStore(s => s.setCursorOnHover)
	const setBounds = useMapStore(s => s.setBounds)
	const loadSnowCannons = useMapStore(s => s.loadSnowCannons)
	const setSelectedId = useMapStore(s => s.setSelectedId)
	const selectedId = useMapStore(s => s.selectedId)

	// Cannons store
	const cannons = useCannonsStore(s => s.cannons)

	const selectedCannon = useMemo(() => {
		if (!cannons || !selectedId) return

		return cannons.find((c: any) => c.id === selectedId)
	}, [selectedId, cannons])

	const handleLoad = async (e: any) => {
		setMap(e.target)

		whenReady(map => {
			setBounds(BOUNDS, 20)
		})

		// Data
		const data = await loadSnowCannons()
		if (!data) return

		// Cannons source
		addSourceOnce('snowCannons', { type: 'geojson', data, promoteId: 'id' })

		// Cannons circles
		addLayerOnce({
			id: 'snowCannons-layer',
			type: 'circle',
			source: 'snowCannons',
			filter: ['!', ['has', 'point_count']],
			paint: {
				'circle-radius': ['case', ['boolean', ['feature-state', 'selected'], false], 12, 8],
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
				'circle-stroke-width': ['case', ['boolean', ['feature-state', 'selected'], false], 5, 3],
				'circle-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], 1, 0.8],
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
		const offClick = onLayerClick('snowCannons-layer', feature => {
			setSelectedId(feature.properties?.id)
		})

		const offOutside = onMapClickOutsideLayer('snowCannons-layer', () => {
			setSelectedId(null)
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
				dragPan
				mapStyle="mapbox://styles/mapbox/dark-v11"
			>
				{selectedCannon && (
					<Popup
						longitude={selectedCannon.longitude}
						latitude={selectedCannon.latitude}
						offset={25}
						closeButton={false}
						closeOnClick={false}
						anchor="bottom"
					>
						<CannonPopup data={selectedCannon} />
					</Popup>
				)}
			</Map>
		</div>
	)
}

export default App
