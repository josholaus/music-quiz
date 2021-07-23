import axios from 'axios'

const BASE_URL = 'https://api.spotify.com/v1'

declare global {
	interface Window {
		Spotify: typeof Spotify
	}
}

class Player {
	/**
	 * The Spotify Playback SDK instance
	 */
	private player: Spotify.Player | undefined
	/**
	 * The unique ID of our Spotify player
	 */
	private deviceId: {} | undefined
	/**
	 * True when our player is playing music, false otherwise
	 */
	private playing = false
	/**
	 * The currently played Spotify track
	 */
	private currentSong: spotify.Track | undefined
	/**
	 * The tracks stored by the current playlist selection
	 */
	private storedTracks: spotify.Track[] = []
	/**
	 * Value of recent volume change in order to limit API requests
	 */
	private recentVolume: number = 0

	constructor(
		private playlists: string[],
		accessToken: string,
		private fastForwardValue?: number[],
		private songsPerPlaylist?: number,
	) {
		const checkPlayerInterval = setInterval(() => {
			if (this.checkForPlayer(accessToken)) {
				clearInterval(checkPlayerInterval)
			}
		}, 500)
	}

	private checkForPlayer(accessToken: string): boolean {
		if (window.Spotify !== null) {
			this.player = new window.Spotify.Player({
				name: 'Josholaus Music Quiz',
				getOAuthToken: (cb) => {
					cb(accessToken)
				},
				volume: 0.25,
			})
			this.createEventHandlers()
			this.player.connect()
			return true
		}
		return false
	}

	private createEventHandlers(): void {
		if (!this.player) {
			console.error(
				'Cannot register event handlers; player is not ready!',
			)
			return
		}
		this.player.on('initialization_error', (e) => {
			console.error(e)
		})
		this.player.on('authentication_error', (e) => {
			console.error(e)
		})
		this.player.on('account_error', (e) => {
			console.error(e)
		})
		this.player.on('playback_error', (e) => {
			console.error(e)
		})

		// Playback status updates
		this.player.on('player_state_changed', (state) => {
			if (state) {
				this.playing = !state.paused
			}
			console.log(state)
		})

		// Ready
		this.player.on('ready', (data) => {
			let { device_id } = data
			console.log('Spotify player ready')
			this.deviceId = device_id
		})
	}

	public getCurrentSong(): spotify.Track | undefined {
		return this.currentSong
	}

	public getPlaylists(): string[] {
		return this.playlists
	}

	public async getPlaylistTracks(
		playlistId: string,
		accessToken: string,
	): Promise<spotify.Track[]> {
		let res: { data: spotify.Playlist } = await axios({
			url: `${BASE_URL}/playlists/${playlistId}`,
			headers: {
				Authorization: 'Bearer ' + accessToken,
			},
		})
		if (res.data.tracks.next) {
			return (await this.getMoreTracks(res.data.tracks.next, accessToken))
				.concat(res.data.tracks.items)
				.map((v: spotify.PlaylistItem) => v.track)
				.sort(() => Math.random() - 0.5)
				.slice(0, this.songsPerPlaylist ?? 100)
		}
		return res.data.tracks.items
			.map((v: spotify.PlaylistItem) => v.track)
			.sort(() => Math.random() - 0.5)
	}

	public async getMoreTracks(
		url: string,
		accessToken: string,
	): Promise<spotify.PlaylistItem[]> {
		let res: { data: spotify.PlaylistItems } = await axios({
			url: url,
			headers: {
				Authorization: 'Bearer ' + accessToken,
			},
		})
		let tracks = res.data.items
		return res.data.next !== null
			? (await this.getMoreTracks(res.data.next, accessToken)).concat(
					tracks,
			  )
			: tracks
	}

	public fetchPlaylistTracks(
		playlistInput: string,
		accessToken: string,
	): Promise<void> {
		return new Promise((resolve, reject) => {
			const playlistValues = playlistInput.split('\n')
			if (playlistValues === this.playlists) {
				resolve()
				return // playlists did not change, don't refetch
			}
			this.playlists = playlistValues
			// TODO: Implement proper input checking and sanitization
			const promises = playlistValues.map((v: string) =>
				this.getPlaylistTracks(
					v.split('/')[4].split('?')[0],
					accessToken,
				),
			)
			Promise.all(promises)
				.then((tracks) => {
					let flatTracks = tracks.flat()
					let existingIds: string[] = []
					let toRemove: spotify.Track[] = []
					flatTracks.forEach((track) => {
						if (existingIds.includes(track.id)) {
							toRemove.push(track)
						}
						existingIds.push(track.id)
					})
					flatTracks = flatTracks.filter((v) => !toRemove.includes(v))
					this.storedTracks = flatTracks
					resolve()
				})
				.catch((err) => {
					reject(err)
				})
		})
	}

	public async nextSong(accessToken: string): Promise<void> {
		this.storedTracks = this.storedTracks.filter((v) => {
			return v.id !== this.currentSong?.id
		})
		await this.playRandomSong(this.storedTracks, accessToken)
	}

	public async playRandomSong(
		items: spotify.Track[],
		accessToken: string,
	): Promise<void> {
		const randomTrack = items[Math.floor(Math.random() * items.length)]
		let res = await axios({
			url: `${BASE_URL}/me/player/play?device_id=${this.deviceId}`,
			method: 'PUT',
			data: JSON.stringify({
				uris: [randomTrack.uri],
				offset: {
					position: 0,
				},
				position_ms:
					Math.floor(
						Math.random() *
							(this.fastForwardValue ?? [15, 30])[0] *
							1000,
					) +
					(this.fastForwardValue ?? [15, 30])[1] * 1000,
			}),
			headers: {
				Authorization: 'Bearer ' + accessToken,
				'Content-Type': 'application/json',
			},
		})
		if (res.status >= 200 && res.status < 300) {
			this.currentSong = randomTrack
			this.playing = true
		} else {
			throw new Error(
				`Could not complete Spotify request (code ${res.status}): ${res.data}`,
			)
		}
	}

	public async togglePlayback(accessToken: string): Promise<void> {
		var url = this.playing
			? `${BASE_URL}/me/player/pause`
			: `${BASE_URL}/me/player/play`
		await axios({
			url: url,
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + accessToken,
			},
		})
		this.playing = !this.playing
	}

	private async setPlaybackVolume(volume: number, accessToken: string): Promise<void> {
		await axios({
			url: `${BASE_URL}/me/player/volume?device_id=${this.deviceId}&volume_percent=${volume}`,
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + accessToken,
			}
		})
	}

	public async setVolume(value: number, accessToken: string): Promise<void> {
		if (value < 0 || value > 100) {
			throw new Error('Invalid volume value!')
		}
		if (Math.abs(value - this.recentVolume) >= 10) {
			await this.setPlaybackVolume(value, accessToken)
			this.recentVolume = value
			return
		}
	}
}

export default Player
