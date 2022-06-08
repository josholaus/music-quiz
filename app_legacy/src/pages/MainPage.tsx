import React from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import PlayerComponent from '../components/player/PlayerComponent'

export default function MainPage() {
	const { hash } = useLocation()
	const params = getHashParams(hash)
	if (
		params.hasOwnProperty('access_token') &&
		params.hasOwnProperty('refresh_token')
	) {
		return (
			<div className="w-full md:px-12">
				<PlayerComponent
					accessToken={params.access_token}
					refreshToken={params.refresh_token}
				/>
			</div>
		)
	} else {
		return <Redirect to="/login"></Redirect>
	}
}

function getHashParams(hash: string): { [key: string]: string } {
	const hashParams: { [key: string]: string } = {}
	const regex = /([^&;=]+)=?([^&;]*)/g
	const input = hash.substring(1)
	let element

	while ((element = regex.exec(input))) {
		hashParams[element[1]] = decodeURIComponent(element[2])
	}

	return hashParams
}
