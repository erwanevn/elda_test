import { Dispatch, useCallback, useEffect, useMemo, useRef } from 'react'
import { useCannonsStore } from '../../../stores/useCannonsStore'
import MultiSelect, { Option } from '../../ui/MultiSelect'
import gsap from 'gsap'

export type FiltersValue = {
	types: string[]
	sectors: number[]
}

type Props = {
	isOpen: boolean
	value: FiltersValue
	onChange: (next: FiltersValue) => void
	range: [number, number]
	setRange: Dispatch<React.SetStateAction<[number, number]>>
}

const Filters = ({ isOpen, value, onChange, range, setRange }: Props) => {
	//Refs
	const containerRef = useRef<HTMLDivElement>(null)

	// Stores
	const cannons = useCannonsStore(s => s.cannons)

	const types = useMemo(() => {
		if (!cannons) return []

		return Array.from(new Set(cannons.map((c: any) => c.type))) as string[]
	}, [cannons])

	const sectors = useMemo(() => {
		if (!cannons) return []

		return Array.from(new Set(cannons.map((c: any) => c.secteur))) as number[]
	}, [cannons])

	const typeOptions: Option[] = useMemo(() => types.map(t => ({ value: t, label: t })), [types])
	const sectorOptions: Option[] = useMemo(() => sectors.map(s => ({ value: s, label: String(s) })), [sectors])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		if (isOpen) {
			gsap.to(container, {
				height: 'auto',
				opacity: 1,
				duration: 0.4,
				padding: '1rem',
				onStart: () => {
					container.style.display = 'block'
				},
			})
		} else {
			gsap.to(container, {
				height: 0,
				opacity: 0,
				padding: 0,
				duration: 0.3,
				onComplete: () => {
					container.style.display = 'none'
				},
			})
		}
	}, [isOpen])

	// Handle objectives ranges inputs
	const handleRange = useCallback(
		(index: 0 | 1) => (e: React.ChangeEvent<HTMLInputElement>) => {
			let raw = e.target.value.replace(',', '.').trim()

			raw = raw.replace(/^0+(?=\d)/, '')

			if (raw === '') {
				setRange(prev => {
					const next: [number, number] = [...prev]
					next[index] = 0
					return next
				})

				e.target.value = ''
				return
			}

			const n = Number(raw)
			const nextVal = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0

			setRange(prev => {
				const next: [number, number] = [...prev]
				next[index] = nextVal

				if (next[0] > next[1]) {
					if (index === 0) next[1] = next[0]
					else next[0] = next[1]
				}

				return next
			})

			e.target.value = String(nextVal)
		},
		[]
	)

	return (
		<div ref={containerRef} className={`rounded-2xl bg-[#101010] hidden`}>
			<div className="flex flex-col gap-3">
				<MultiSelect<string>
					label="Types"
					placeholder="Tous les types"
					options={typeOptions}
					value={value.types}
					onChange={types => onChange({ ...value, types })}
				/>

				<MultiSelect<number>
					label="Secteurs"
					placeholder="Tous les secteurs"
					options={sectorOptions}
					value={value.sectors}
					onChange={sectors => onChange({ ...value, sectors })}
				/>

				<div className="flex gap-2 h-12 text-white items-center relative">
					<label className="text-lg text-nowrap">Objectif min</label>
					<input
						type="number"
						inputMode="numeric"
						pattern="[0-9]*"
						value={range[0]}
						onChange={handleRange(0)}
						className="bg-neutral-900 px-5 pr-12 border-none focus:outline-2 outline-white rounded-2xl w-full h-full"
					/>
					<label className="absolute right-5">m3</label>
				</div>

				<div className="flex gap-2 h-12 text-white items-center relative">
					<label className="text-lg text-nowrap">Objectif max</label>
					<input
						type="number"
						inputMode="numeric"
						pattern="[0-9]*"
						value={range[1]}
						onChange={handleRange(1)}
						className="bg-neutral-900 px-5 pr-12 border-none focus:outline-2 outline-white rounded-2xl w-full h-full"
					/>
					<label className="absolute right-5">m3</label>
				</div>
			</div>
		</div>
	)
}

export default Filters
