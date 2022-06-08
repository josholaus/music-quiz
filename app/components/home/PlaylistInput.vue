<template>
	<div>
		<p>Enter the playlist URLs which should be used</p>
		<textarea
			v-model="playlists"
			class="border-zinc-300 border-2 rounded-sm w-full h-32 my-2"
		/>
		<ButtonSubmit @submit="submitPlaylists" :loading="loading" />
	</div>
</template>

<script lang="ts">
import axios from 'axios'
import { BASE_URL } from '~/definitions/constants'

export default {
	emits: 'tracksReceived',
	name: 'PlaylistInput',
	data() {
		return {
			playlists: '',
			loading: false,
			playlistTracks: [],
		}
	},
	methods: {
		async getMorePlaylistTracks(
			url: string,
		): Promise<spotify.PlaylistItem[]> {
			const res = await axios({
				url: url,
				headers: {
					Authorization: 'Bearer ' + this.$route.query.access_token,
				},
			})
			res.data = res.data as spotify.PlaylistItems
			return res.data.next !== null
				? (await this.getMorePlaylistTracks(res.data.next)).concat(
						res.data.items,
				  )
				: res.data.items
		},
		async getPlaylistTracks(url: string): Promise<spotify.Track[]> {
			const playlistId = url.split('/')[4].split('?')[0]
			const res = await axios({
				url: `${BASE_URL}/playlists/${playlistId}`,
				headers: {
					Authorization: 'Bearer ' + this.$route.query.access_token,
				},
			})
			res.data = res.data as spotify.PlaylistItems
			if (res.data.tracks.next) {
				return (await this.getMorePlaylistTracks(res.data.tracks.next))
					.concat(res.data.tracks.items)
					.map((v: spotify.PlaylistItem) => v.track)
					.sort(() => Math.random() - 0.5)
					.slice(0, 100) // TODO: fixed 100 songs per playlist
			}
			return res.data.tracks.items
				.map((v: spotify.PlaylistItem) => v.track)
				.sort(() => Math.random() - 0.5)
		},
		async submitPlaylists(): Promise<void> {
			this.loading = true
			this.playlistTracks = []
			let split = this.playlists.split('\n')
			if (
				split.some(
					(playlist) =>
						!playlist.startsWith(
							'https://open.spotify.com/playlist/',
						),
				)
			) {
				alert('Invalid input!') // TODO: error message
			} else {
				try {
					for (let playlist of split) {
						const tracks = await this.getPlaylistTracks(playlist)
						this.playlistTracks = this.playlistTracks.concat(tracks)
					}
					this.$emit('tracksReceived', this.playlistTracks)
				} catch (err) {
					if (err.response.data?.error) {
						alert(
							`Error ${err.response.data.error.status}: ${err.response.data.error.message}`,
						) // TODO: error mesage
					} else {
						alert(
							'An unknown error occurred, check console for details',
						)
						console.error(err)
					}
				}
			}
			this.loading = false
		},
	},
}
</script>
