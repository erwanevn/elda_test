import { useMemo } from 'react'
import { useMapStore } from '../../stores/useMapStore'
import { clamp } from '../../utils/math'
import { getColorFromState } from '../panels/cannons/CannonCard'

type Props = { data: any }

const CannonPopup = ({ data }: Props) => {
	// Stores
	const setSelectedId = useMapStore(s => s.setSelectedId)

	const {
		id,
		numero_regard,
		secteur,
		nom_piste,
		type,
		latitude,
		longitude,
		latest_measurement: { conso_eau_m3, objectif_mini_m3, objectif_max_m3 },
	} = data

	const per = useMemo(() => {
		if (!objectif_max_m3 || !isFinite(objectif_max_m3)) return 0

		const p = (conso_eau_m3 / objectif_max_m3) * 100

		return clamp(Math.ceil(p), 0, 1000)
	}, [conso_eau_m3, objectif_max_m3])

	const color = useMemo(() => getColorFromState(per), [per])

	return (
		<div className="rounded-xl p-4 text-sm bg-[#101010] text-white">
			<div className="flex gap-1 justify-between">
				<h3 className="font-semibold text-xl mb-1">Enneigeur #{numero_regard}</h3>
				<div className="h-8 px-3 flex justify-center gap-1.5 items-center mr-2">
					<div className="w-4 h-4 rounded" style={{ backgroundColor: `#${color}99` }} />
					<h3 className="text-lg">{per}%</h3>
				</div>
			</div>
			<div className="flex flex-col text-lg font-light">
				<h2>Secteur: {secteur}</h2>
				<h2>Piste: {nom_piste}</h2>
				<h2>Type: {type}</h2>
				<h2>
					Min: {objectif_mini_m3} - Conso: {conso_eau_m3} - Max: {objectif_max_m3}
				</h2>
			</div>
		</div>
	)
}

export default CannonPopup
