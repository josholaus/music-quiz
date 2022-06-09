<template>
	<Head>
		<Title>Music Quiz - Home</Title>
	</Head>
	<div>
		<div class="text-center py-20 h-full">
			<HomePlayer v-if="player" />
			<HomePlaylistInput v-else @tracksReceived="updatePlayer" />
		</div>
	</div>
</template>

<script lang="ts">
export default {
	ssr: false,
	data() {
		return {
			tracks: [],
			player: false,
		}
	},
	methods: {
		updatePlayer(tracks: spotify.Track[]) {
			this.tracks = tracks
			this.player = true
		},
	},
	created() {
		if (
			!this.$route.query.access_token ||
			!this.$route.query.refresh_token
		) {
			this.$router.push('/start')
		}
	},
}
</script>