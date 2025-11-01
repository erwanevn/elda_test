import { MouseEvent, useMemo } from 'react'
import { useMap } from '../../../hooks/useMap'
import { useMapStore } from '../../../stores/useMapStore'

type Props = { data: any }

const COLOR_THRESHOLDS = [
	{ limit: 1, color: 'cccccc' },
	{ limit: 34, color: '2ecc71' },
	{ limit: 67, color: 'f1c40f' },
	{ limit: 100, color: 'e67e22' },
	{ limit: Infinity, color: 'e74c3c' },
]

const getColorFromState = (v: number): string => COLOR_THRESHOLDS.find(t => v < t.limit)?.color ?? '#e74c3c'

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

const CannonCard = ({ data }: Props) => {
	const {
		numero_regard,
		secteur,
		nom_piste,
		type,
		latitude,
		longitude,
		latest_measurement: { conso_eau_m3, objectif_mini_m3, objectif_max_m3 },
	} = data

	// Stores
	const { focusOnPoint } = useMapStore()

	const per = useMemo(() => {
		if (!objectif_max_m3 || !isFinite(objectif_max_m3)) return 0

		const p = (conso_eau_m3 / objectif_max_m3) * 100

		return clamp(Math.ceil(p), 0, 1000)
	}, [conso_eau_m3, objectif_max_m3])

	const color = useMemo(() => getColorFromState(per), [per])

	const handleClick = (e: MouseEvent<HTMLDivElement>) => {
		focusOnPoint([longitude, latitude], 17)
	}

	return (
		<div
			className="min-h-30 rounded-2xl bg-[#101010cc] text-white p-3 border-transparent cursor-pointer transition hover:border-2 hover:border-white"
			onClick={handleClick}
		>
			<div className="flex justify-between">
				<h1 className="text-[22px]">
					#{numero_regard} - Secteur {secteur}
				</h1>
				<div
					className="h-8 px-3 flex justify-center gap-2 items-center rounded-lg "
					style={{ backgroundColor: `#${conso_eau_m3 ? '69B75F' : 'BF4336'}99` }}
				>
					<div
						className="w-3 h-3 rounded-2xl "
						style={{ backgroundColor: `#${conso_eau_m3 ? '69B75F' : 'BF4336'}99` }}
					/>
					<h3 className="text-lg">{conso_eau_m3 ? 'on' : 'off'}</h3>
				</div>
			</div>
			<div className="flex justify-between">
				<h3 className="font-light text-md mt-1">
					{nom_piste} / {type}
				</h3>
				<div className="h-8 px-3 flex justify-center gap-1.5 items-center">
					<div className="w-4 h-4 rounded" style={{ backgroundColor: `#${color}99` }} />
					<h3 className="text-lg">{per}%</h3>
				</div>
			</div>
			<h3 className="font-light text-md mt-1">
				min: {objectif_mini_m3} - conso: {conso_eau_m3} - max: {objectif_max_m3}
			</h3>
		</div>
	)
}

export default CannonCard
