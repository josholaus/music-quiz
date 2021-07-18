import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Title } from '../../components'
import Player from './Player'

export interface PlayerProperties {
	accessToken: string
	refreshToken: string
}

export default function PlayerComponent(props: PlayerProperties) {
	const { t } = useTranslation()
	const accessToken = props.accessToken
	const refreshToken = props.refreshToken
	const player = new Player([])
	
	return (
		<>
			<Helmet>
				<title>{t('pages.player.helmet.title')}</title>
			</Helmet>
			<Title>{t('pages.player.title')}</Title>

			<div className="w-full mt-3 flex flex-row bg-black">
				<div className="text-white">
					<img className="h-24 w-24" alt="\\\" />
				</div>
				<div className="flex-1 text-white">
					<div>Song name</div>
					<div>Collaborators</div>
					<div className="flex flex-row">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
						</svg>
					</div>
				</div>
			</div>
		</>
	)
}


