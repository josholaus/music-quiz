import React from 'react'
import { Translation } from 'react-i18next'
import EditPlaylistsButton from './buttons/EditPlaylistsButton'
import NextButton from './buttons/NextButton'
import PlayButton from './buttons/PlayButton'
import ShowButton from './buttons/ShowButton'
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
	const [shown, setShown] = React.useState(false)

	const playNextSong = () => {
		setShown(false)
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

	const toggleShow = () => {
		setShown(!shown)
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
	}, [props])

	return (
		<div className="w-full mt-3 flex flex-row bg-black rounded-md">
			<div className="text-white my-auto">
				<img
					className="h-64 w-64 rounded-sm"
					alt="Cover Art"
					src={
						!currentSong.album
							? '/assets/placeholder.svg'
							: shown
							? currentSong.album.images[0].url
							: '/assets/question.svg'
					}
				/>
			</div>
			<div className="flex-1 my-auto text-white py-5 px-8">
				<div className="font-bold text-3xl">
					{currentSong.name ? (
						shown ? (
							currentSong.name
						) : (
							<span className="text-5xl">?</span>
						)
					) : (
						<Translation>
							{(t) => t('pages.player.controller.loading')}
						</Translation>
					)}
				</div>
				<div className="font-bold">
					{currentSong.artists && shown
						? currentSong.artists.map((v) => v.name).join(', ')
						: null}
				</div>
				<div>
					{currentSong.album && shown
						? currentSong.album.name !== currentSong.name
							? currentSong.album.name
							: null
						: null}
				</div>
				<div className="flex flex-row justify-center mt-5">
					<ShowButton action={toggleShow} shown={shown} />
					<PlayButton action={toggleSong} playing={playing} />
					<NextButton action={playNextSong} />
				</div>
				<div className="flex flex-row justify-center mt-2">
					<EditPlaylistsButton
						action={() => props.controllerViewCallback()}
					/>
				</div>
			</div>
		</div>
	)
}
