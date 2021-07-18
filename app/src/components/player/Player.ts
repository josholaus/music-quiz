import axios from 'axios'

const BASE_URL = 'https://api.spotify.com/v1'

class Player {
	private currentSong: spotify.Track | undefined
	private storedTracks: spotify.Track[] = []

	constructor(
		private playlists: string[],
		private fastForwardValue?: number[],
		private songsPerPlaylist?: number,
	) {}

	public getCurrentSong(): spotify.Track | undefined {
		return this.currentSong
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
		return res.data.tracks.items.map((v: spotify.PlaylistItem) => v.track)
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
		return res.data.next !== null ? (await this.getMoreTracks(res.data.next, accessToken)).concat(tracks) : tracks
	}

	public fetchPlaylistTracks(accessToken: string) {
		return null
		/*
	return new Promise((resolve, reject) => {
		const playlistValues = $('#playlist-values').val().split('\n')
		if (playlistValues === playlists) {
			return // playlists did not change, don't refetch
		}
		playlists = playlistValues
		const promises = playlistValues.map((v: any) =>
			getPlaylistTracks(v.split('/')[4].split('?')[0], accessToken),
		)
		Promise.all(promises)
			.then((values) => {
				let items = values.flat()
				let exists: any[] = []
				let toRemove: any[] = []
				items.forEach((v: any) => {
					if (exists.includes(v.id)) {
						toRemove.push(v)
					}
					exists.push(v.id)
				})
				items = items.filter((v) => !toRemove.includes(v))
				this.storedTracks = items
				// $('#left-songs-number').html(this.storedTracks.length)
				resolve(null)
			})
			.catch((err) => {
				console.log(err)
				alert(
					'Error fetching playlists. Do you have access to all of them?',
				)
			})
	})*/
	}

	public async nextSong(accessToken: string): Promise<void> {
		this.storedTracks = this.storedTracks.filter((v: any) => {
			return v.id !== this.currentSong?.id
		})
		// $('#left-songs-number').html(this.storedTracks.length)
		await this.playRandomSong(this.storedTracks, accessToken)
	}

	public async playRandomSong(items: spotify.Track[], accessToken: string): Promise<void> {
		const randomTrack = items[Math.floor(Math.random() * items.length)]
		const artists = randomTrack.artists?.map((v: any) => v.name).join(', ')
		const name = randomTrack.name
		// $('#track-info').html(artists + ' - "' + name + '"')
		await axios({
			url: `${BASE_URL}/me/player/play`,
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
		this.currentSong = randomTrack
		// $('#pause-playlist').html('⏸')
	}

	public async pausePlayback(accessToken: string): Promise<void> {
		// const element = $('#pause-playlist')
		var url = ''
		/*
	if (element.html() === '⏸') {
		url = `https://api.spotify.com/v1/me/player/pause`
	} else {
		url = `https://api.spotify.com/v1/me/player/play`
	}
	*/
		await axios({
			url: url,
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + accessToken,
			},
		})
		/*
			if (element.html() === '⏸') {
				element.html('⏵️')
			} else {
				element.html('⏸')
			}
			*/
	}
}

export default Player
