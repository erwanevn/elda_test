import { Fragment, useEffect, useMemo, useState } from 'react'

import { useCannonsStore } from '../../../stores/useCannonsStore'
import CannonCard from './CannonCard'
import Button from '../../ui/Button'
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg'

type Props = {}

const Cannons = ({}: Props) => {
	// Stores
	const { cannons, loadCannons } = useCannonsStore()

	// States
	const [search, setSearch] = useState('')
	const [filteredCannons, setFilteredCannons] = useState<any | null>(null)

	// Load cannons
	useEffect(() => {
		if (!cannons) loadCannons()
	}, [cannons, loadCannons])

	// Calc current cannons stats (total, actives, conso)
	const stats = useMemo(() => {
		if (!cannons) return { total: 0, actives: 0 }

		const actives = cannons.filter((c: any) => Number(c.latest_measurement.conso_eau_m3) > 0).length
		const conso = cannons.reduce((sum: number, c: any) => {
			return sum + (c.latest_measurement?.conso_eau_m3 || 0)
		}, 0)

		return { total: cannons.length, actives, conso }
	}, [cannons])

	const statsItems = [
		{ value: stats.total, label: 'Total' },
		{
			value: stats.actives,
			label: 'Actifs',
			icon: <div className="w-3 h-3 rounded-2xl bg-[#2ecc71]" />,
		},
		{ value: `${(stats.conso / 1000).toFixed(1)} m3`, label: 'Conso' },
	]

	useEffect(() => {
		if (!cannons) return

		if (!search.trim()) {
			setFilteredCannons(cannons)
		} else {
			const filtered = cannons.filter((c: any) => c.nom_piste?.toLowerCase().includes(search.toLowerCase()))
			setFilteredCannons(filtered)
		}
	}, [search, cannons])

	return (
		<div className="flex flex-col h-full min-h-0 gap-3 mt-5">
			{/* Stats */}
			<div className="bg-[#101010cc] rounded-2xl min-h-30 text-white flex items-center">
				{statsItems.map((item, i) => (
					<Fragment key={i}>
						<div className="h-full w-full flex justify-center flex-col items-center gap-1.5">
							<h1 className="text-3xl">{item.value}</h1>
							<div className="flex gap-2 items-center">
								{item.icon}
								<h2 className="text-[28px] font-light">{item.label}</h2>
							</div>
						</div>

						{i < statsItems.length - 1 && (
							<div className="h-[80%] border-l-2 border-dashed border-[#ffffff3f]" />
						)}
					</Fragment>
				))}
			</div>

			{/* Filters */}
			<div className="h-15 flex gap-3">
				<div className="flex-1 relative flex items-center">
					<input
						className="bg-[#101010] text-white px-5 pr-12 border-none focus:outline-2 outline-white rounded-2xl w-full h-full"
						placeholder="Rechercher..."
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
					<SearchIcon className="absolute h-6 w-6 stroke-1 stroke-white right-5" />
				</div>
				<Button label="Filtres" handler={() => console.log('test')} />
			</div>

			{filteredCannons && cannons && filteredCannons.length < cannons.length && (
				<h1 className="text-white text-center text-lg">
					{filteredCannons.length} enneigeur{filteredCannons.length > 1 && 's'} filtré
					{filteredCannons.length > 1 && 's'}.
				</h1>
			)}

			{/* Cannons cards */}
			<div className="flex flex-col flex-1 overflow-y-auto gap-2">
				{filteredCannons && filteredCannons.map((c: any) => <CannonCard data={c} key={c.id} />)}
			</div>
		</div>
	)
}

export default Cannons
