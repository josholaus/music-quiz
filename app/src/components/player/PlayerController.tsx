import React from 'react'
import { Translation } from 'react-i18next'
import NextButton from './buttons/NextButton'
import PlayButton from './buttons/PlayButton'
import Player from './Player'
import { PlayerComponentProperties } from './PlayerComponent'

interface PlayerControllerProperties {
	player: Player
	playerProperties: PlayerComponentProperties
	playlists: string
	controllerViewCallback: () => void
}

export default function PlaylistController(props: PlayerControllerProperties) {
	const [currentSong, setCurrentSong] = React.useState({} as spotify.Track)
	const [playing, setPlaying] = React.useState(false)

	const playNextSong = () => {
		props.player
			.nextSong(props.playerProperties.accessToken)
			.then(() => {
				const song = props.player.getCurrentSong()
				setCurrentSong(song as spotify.Track)
				setPlaying(true)
			})
			.catch((err) => {
				alert('An error has occurred. Please try again')
			})
	}

	const toggleSong = () => {
		props.player
			.togglePlayback(props.playerProperties.accessToken)
			.then(() => {
				setPlaying(!playing)
			})
	}

	React.useEffect(() => {
		const fetchSongs = async () => {
			try {
				await props.player.fetchPlaylistTracks(
					props.playlists,
					props.playerProperties.accessToken,
				)
			} catch (err) {
				alert(
					'An error occurred while fetching playlist tracks, do you have access to all of them?',
				)
				props.controllerViewCallback()
			}
			playNextSong()
		}
		fetchSongs()
	}, [])
	return (
		<div className="w-full mt-3 flex flex-row bg-black rounded-md">
			<div className="text-white">
				<img
					className="h-64 w-64"
					alt="Cover Art"
					src={
						!currentSong.album
							? '/assets/placeholder.svg'
							: currentSong.album.images[0].url
					}
				/>
			</div>
			<div className="flex-1 my-auto text-white py-5 px-8">
				<div className="font-bold text-3xl">
					{currentSong.name ? (
						currentSong.name
					) : (
						<Translation>
							{(t) => t('pages.player.controller.loading')}
						</Translation>
					)}
				</div>
				<div className="font-bold">
					{currentSong.artists
						? currentSong.artists.map((v) => v.name).join(', ')
						: null}
				</div>
				<div>
					{currentSong.album
						? currentSong.album.name !== currentSong.name
							? currentSong.album.name
							: null
						: null}
				</div>
				<div className="flex flex-row justify-center mt-5">
					<PlayButton action={toggleSong} playing={playing} />
					<NextButton action={playNextSong} />
				</div>
			</div>
		</div>
	)
}
