import React from 'react'

interface PlaylistInputProperties {
	onChange: (value: string) => void
}

export default function PlaylistInput(props: PlaylistInputProperties) {
	return (
		<textarea
			id="playlist-values"
			rows={20}
			cols={80}
			placeholder="Playlist URLs"
			onChange={(event) => props.onChange(event.target.value)}></textarea>
	)
}
