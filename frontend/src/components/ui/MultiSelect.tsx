import { useEffect, useRef, useState } from 'react'

export type Option = { value: string | number; label: string }

type MultiSelectProps<T extends string | number> = {
	label?: string
	placeholder?: string
	options: Option[]
	value: T[]
	onChange: (next: T[]) => void
	className?: string
}

const MultiSelect = <T extends string | number>({
	label,
	placeholder = 'Sélectionner…',
	options,
	value,
	onChange,
	className = '',
}: MultiSelectProps<T>) => {
	// Refs
	const ref = useRef<HTMLDivElement>(null)

	// States
	const [open, setOpen] = useState(false)

	// Auto close
	useEffect(() => {
		const onClickOutsite = (e: MouseEvent) => {
			if (!ref.current) return

			if (!ref.current.contains(e.target as Node)) setOpen(false)
		}

		document.addEventListener('mousedown', onClickOutsite)

		return () => document.removeEventListener('mousedown', onClickOutsite)
	}, [])

	const toggleValue = (v: T) => {
		const exists = value.includes(v)
		onChange(exists ? (value.filter(x => x !== v) as T[]) : [...value, v])
	}

	const allSelected = value.length > 0 && value.length === options.length

	return (
		<div ref={ref} className={`relative ${className} flex items-center gap-2`}>
			{label && <label className="text-lg text-white">{label}</label>}

			<button
				type="button"
				onClick={() => setOpen(o => !o)}
				className="w-full rounded-xl bg-neutral-900 px-3 py-2 text-left cursor-pointer text-white border-2 border-transparent hover:border-gray-400 focus:outline-none focus:border-white"
			>
				<div className="flex items-center justify-between gap-2">
					<div className="min-h-6 flex flex-wrap gap-1">
						{value.length === 0 ? (
							<span className="text-gray-300">{placeholder}</span>
						) : (
							value.slice(0, 3).map(v => {
								const opt = options.find(o => o.value === v)

								return (
									<span key={v} className="rounded-lg bg-neutral-800 px-3 py-1 text-sm">
										{opt?.label ?? v}
									</span>
								)
							})
						)}

						{value.length > 3 && (
							<span className="rounded-lg bg-neutral-800 px-3 py-1 text-sm">+{value.length - 3}</span>
						)}
					</div>
					<span className={`transition ${open ? 'rotate-180' : ''}`}>▾</span>
				</div>
			</button>

			{open && (
				<div className="absolute top-11 z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border-2 border-gray-500 bg-neutral-900 p-2 shadow-xl">
					<div className="mb-2 flex items-center gap-2">
						<button
							type="button"
							className="rounded-lg border border-neutral-700 px-2 py-1 text-sm text-white cursor-pointer hover:bg-[#222222]"
							onClick={() => onChange(allSelected ? [] : (options.map(o => o.value) as T[]))}
						>
							{allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
						</button>
						{value.length > 0 && (
							<button
								type="button"
								className="rounded-lg border border-neutral-700 px-2 py-1 text-sm text-white cursor-pointer hover:bg-[#222222]"
								onClick={() => onChange([])}
							>
								Vider
							</button>
						)}
					</div>

					<ul className="space-y-1">
						{options.map(opt => {
							const checked = value.includes(opt.value as T)

							return (
								<li key={String(opt.value)}>
									<label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-neutral-800">
										<input
											type="checkbox"
											className="h-5 w-5 accent-[#101010]"
											checked={checked}
											onChange={() => toggleValue(opt.value as T)}
										/>
										<span className="text-md text-white">{opt.label}</span>
									</label>
								</li>
							)
						})}
					</ul>
				</div>
			)}
		</div>
	)
}

export default MultiSelect
