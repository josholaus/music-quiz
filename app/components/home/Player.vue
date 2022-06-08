<template>
	<Head>
		<Script async src="https://sdk.scdn.co/spotify-player.js" />
	</Head>
	<div>
		<p>I'm a player</p>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'Player',
	data() {
		return {
			player: null,
		}
	},
	mounted() {
		window.onSpotifyWebPlaybackSDKReady = () => {
			this.player = new Spotify.Player({
				name: 'Debugolaus Music Quiz',
				getOAuthToken: async (callback) => {
					const res = await axios({
						url: `http://localhost:8080/refresh_token?refresh_token=${this.$route.query.refresh_token}`,
						method: 'GET',
					})
					if (res.status >= 200 && res.status < 300) {
						await this.$router.push({
							path: '/',
							query: {
								access_token: res.data.access_token,
								refresh_token: res.data.refresh_token,
							},
						})
						callback(res.data.access_token)
					} else {
						alert('error refresh token') // TODO: error message
					}
				},
				volume: 0.5,
			})
			this.player.connect().then((success) => {
				if (success) {
					console.log(
						'The Web Playback SDK successfully connected to Spotify!',
					)
				}
			})
		}
	},
}
</script>
