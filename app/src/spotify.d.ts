declare namespace spotify {
	interface Entity {
		id: string
		external_urls: {}
		href: string
		type: string
		uri: string
	}

	interface Track extends Entity {
		album: spotify.Album
		artists: sptofiy.Artist[]
		available_markets: string[]
		disc_number: number
		duration_ms: number
		episode: boolean
		explicit: boolean
		external_ids: {}
		is_local: boolean
		name: string
		popularity: number
		preview_url: string
		track: boolean
		track_number: number
	}

	interface Album extends Entity {
		album_type: string
		artists: spotify.Artist[]
		available_markets: string[]
		images: spotify.Image[]
		name: string
		release_date: string
		release_date_precision: string
		total_tracks: number
	}

	interface User extends Entity {
		display_name: string
	}

	interface Artist extends Entity {
		name: string
	}

	interface Playlist extends Entity {
		collaborative: boolean
		description: string
		followers: { href: string; total: number }
		images: spotify.Image[]
		name: string
		owner: spotify.User
		primary_color: string
		public: boolean
		snapshot_id: string
		tracks: spotify.PlaylistItems
	}

	interface PlaylistItems {
		href: string
		items: spotify.PlaylistItem[]
		limit: number
		next: string
		offset: number
		previous: string
		total: number
	}

	interface Image {
		height: number
		width: number
		url: string
	}

	interface PlaylistItem {
		added_at: string
		added_by: spotify.User
		is_local: boolean
		primary_color: string
		track: spotify.Track
		video_thumbnail: {}
	}
}
