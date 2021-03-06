import React from 'react'
import { Translation } from 'react-i18next'
import Slider from 'react-input-slider'
import EditPlaylistsButton from './buttons/EditPlaylistsButton'
import NextButton from './buttons/NextButton'
import PlayButton from './buttons/PlayButton'
import RefreshTokenButton from './buttons/RefreshTokenButton'
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
	const [refreshing, setRefreshing] = React.useState(false)
	const [volume, setVolume] = React.useState(25)
	const [remainingSongs, setRemainingSongs] = React.useState(-1)

	const playNextSong = React.useCallback(async () => {
		if (remainingSongs === 0) {
			alert(
				'No more songs available! Please reload the playlist or add another playlist',
			)
			props.controllerViewCallback()
			return
		}
		setShown(false)
		try {
			await props.player.nextSong(props.playerProperties.accessToken)
		} catch (err) {
			console.error(err)
			alert('An error occurred while playing the next song')
		}
		const song = props.player.getCurrentSong()
		setCurrentSong(song as spotify.Track)
		setRemainingSongs(props.player.getAvailableSongNumber() - 1)
		setPlaying(true)
	}, [props, remainingSongs])

	const fetchSongs = React.useCallback(async () => {
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
	}, [props])

	const toggleSong = React.useCallback(async () => {
		await props.player.togglePlayback(props.playerProperties.accessToken)
		setPlaying(!playing)
	}, [props, playing])

	const refreshToken = React.useCallback(async () => {
		setRefreshing(true)
		try {
			const data = await props.player.refreshToken(
				props.playerProperties.refreshToken,
			)
			props.playerProperties.accessToken = data.access_token
			props.playerProperties.refreshToken = data.refresh_token
			setRefreshing(false)
			alert('Successfully refreshed token')
		} catch (err) {
			setRefreshing(false)
			alert('An error occurred while refreshing token')
		}
	}, [props])

	const toggleShow = () => {
		setShown(!shown)
	}

	React.useEffect(() => {
		fetchSongs()
	}, [props, fetchSongs])

	return (
		<>
			<div className="mx-auto my-5 flex w-max">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 mx-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
						clipRule="evenodd"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
					/>
				</svg>
				<div className="pt">
					<Slider
						axis="x"
						x={volume}
						onChange={({ x }) => {
							setVolume(x)
							props.player.setVolume(
								x,
								props.playerProperties.accessToken,
							)
						}}
						styles={{
							track: {
								backgroundColor: 'grey',
							},
							thumb: {
								width: 25,
								height: 25,
							},
						}}
					/>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 mx-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
					/>
				</svg>
			</div>
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
						<RefreshTokenButton
							action={refreshToken}
							className={refreshing ? 'animate-spin' : ''}
						/>
					</div>
				</div>
			</div>
			<div className="my-5 mx-auto w-max">
				<p>
					<Translation>
						{(t) => t('pages.player.controller.remaining')}
					</Translation>{' '}
					<span className="font-bold">
						{Math.max(0, remainingSongs)}
					</span>
				</p>
			</div>
		</>
	)
}
