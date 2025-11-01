import { useEffect, useRef } from 'react'
import gsap from 'gsap'

import { ReactComponent as SnowIcon } from '../../assets/icons/snow.svg'
import { ReactComponent as StatsIcon } from '../../assets/icons/stats.svg'

const ICONS = {
	snow: SnowIcon,
	stats: StatsIcon,
}

type NavProps = { icon: 'snow' | 'stats'; selected: boolean; handleClick: (id: number) => any }

const NavBtn = ({ icon, selected, handleClick }: NavProps) => {
	const Icon = ICONS[icon]

	return (
		<div
			className={`w-15 h-15 flex justify-center items-center cursor-pointer z-10`}
			onClick={() => handleClick(Object.keys(ICONS).indexOf(icon))}
		>
			<Icon className={`h-7 w-7 stroke-white stroke-[1.5px] transition ${!selected && 'not-hover:opacity-80'}`} />
		</div>
	)
}

const Nav = ({ current, setCurrent }: { current: number; setCurrent: any }) => {
	const indicatorRef = useRef(null)

	useEffect(() => {
		const targetY = current * (15 * 4 + 28)

		gsap.to(indicatorRef.current, {
			y: targetY,
			duration: 0.4,
			ease: 'power2.out',
		})
	}, [current])

	return (
		<div className="flex flex-col gap-7">
			<div ref={indicatorRef} className="w-15 h-15 bg-[#101010] rounded-2xl absolute" />
			<NavBtn icon="snow" selected={current === 0} handleClick={setCurrent} />
			<NavBtn icon="stats" selected={current === 1} handleClick={setCurrent} />
		</div>
	)
}

export default Nav
