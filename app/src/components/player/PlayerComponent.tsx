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
	inputView: PlaylistInput,
	controllerView: PlaylistController,
}

export default function PlayerComponent(props: PlayerComponentProperties) {
	const { t } = useTranslation()
	const accessToken = props.accessToken
	const refreshToken = props.refreshToken
	const player = new Player([])

	const controllerViewCallback = () => {
		setCurrentView(<PlayerViews.inputView callback={inputViewCallback} />)
	}

	const inputViewCallback = (values: string) => {
		setCurrentView(
			<PlayerViews.controllerView
				player={player}
				playerProperties={props}
				playlists={values}
				controllerViewCallback={controllerViewCallback}
			/>,
		)
	}

	const [currentView, setCurrentView] = React.useState(
		<PlayerViews.inputView callback={inputViewCallback} />,
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
