import Button from '../ui/Button'
import { ReactComponent as PlusIcon } from '../../assets/icons/plus.svg'

type Props = { currentPanel: number }

const CONFIGS: { label: string; button?: { label: string; icon?: any; handler: () => any } }[] = [
	{
		label: 'Enneigeurs',
		button: { label: 'Créer', icon: PlusIcon, handler: () => console.log('create new cannon event') },
	},
	{ label: 'Statistiques' },
]

const Header = ({ currentPanel }: Props) => {
	const { label, button } = CONFIGS[currentPanel]

	return (
		<div className="flex justify-between w-full items-center h-15">
			<h1 className="text-white text-4xl">{label}</h1>
			{button && <Button label={button.label} Icon={button.icon} handler={button.handler} />}
		</div>
	)
}

export default Header
