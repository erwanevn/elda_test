import { useState } from 'react'

import Nav from './Nav'
import Header from './Header'
import Cannons from './cannons/Cannons'

const Panel = () => {
	const [currentPanel, setCurrentPanel] = useState(0) // 0: snow, 1: stats

	return (
		<div className="h-full w-[30%] bg-[#101010b2] backdrop-blur-[2px] absolute z-10 rounded-2xl opacity-90 overflow-hidden flex">
			<div className="w-25 border-r-3 border-[#101010b9] h-full flex justify-center items-center relative">
				<div className="absolute top-10">
					<img src="logo.png" alt="" />
				</div>
				<Nav current={currentPanel} setCurrent={setCurrentPanel} />
			</div>

			<div className="border-20 border-transparent w-full h-full">
				<div className="flex flex-col h-full">
					<Header currentPanel={currentPanel} />

					{currentPanel === 0 && <Cannons />}
				</div>
			</div>
		</div>
	)
}

export default Panel
