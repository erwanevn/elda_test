import { useEffect, useMemo, useRef } from 'react'
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
}

const Filters = ({ isOpen, value, onChange }: Props) => {
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
			</div>
		</div>
	)
}

export default Filters
