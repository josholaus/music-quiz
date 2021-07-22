import * as React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Title } from '../../components'
import Player from './Player'
import PlaylistController from './PlayerController'
import PlaylistInput from './PlaylistInput'

export interface PlayerComponentProperties {
	accessToken: string
	refreshToken: string
}

const PlayerViews = {
	InputView: PlaylistInput,
	ControllerView: PlaylistController,
}

export default function PlayerComponent(props: PlayerComponentProperties) {
	const { t } = useTranslation()
	const player = new Player([], props.accessToken)

	const controllerViewCallback = () => {
		setCurrentView(
			<PlayerViews.InputView
				callback={inputViewCallback}
				values={player.getPlaylists()?.join('\n')}
			/>,
		)
	}

	const inputViewCallback = (values: string) => {
		setCurrentView(
			<PlayerViews.ControllerView
				player={player}
				playerProperties={props}
				playlists={values}
				controllerViewCallback={controllerViewCallback}
			/>,
		)
	}

	const [currentView, setCurrentView] = React.useState(
		<PlayerViews.InputView callback={inputViewCallback} />,
	)

	return (
		<>
			<Helmet>
				<title>{t('pages.player.helmet.title')}</title>
			</Helmet>
			<Title>{t('pages.player.title')}</Title>
			{currentView}
		</>
	)
}
