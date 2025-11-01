type Props = { label: string; Icon?: any; handler: () => any }

const Button = ({ label, Icon, handler }: Props) => {
	return (
		<div
			className="flex gap-3 items-center px-6 py-3 bg-[#101010] rounded-2xl cursor-pointer transition hover:bg-[#222222]"
			onClick={handler}
		>
			{Icon && <Icon className="h-6 w-6 stroke-white stroke-2" />}
			<div className="text-2xl font-normal text-white">{label}</div>
		</div>
	)
}

export default Button
