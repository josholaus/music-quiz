import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../buttons/Button'

interface PlaylistInputProperties {
	values?: string
	callback: (value: string) => void
}

export default function PlaylistInput(props: PlaylistInputProperties) {
	var value = props.values ?? ''
	const { t } = useTranslation()

	return (
		<>
			<p className="my-3">
				Please enter Playlist URLs separated by newlines:
			</p>
			<textarea
				id="playlist-values"
				placeholder="Playlist URLs"
				className="w-full p-3 border border-gray-500 rounded-sm"
				defaultValue={props.values}
				onChange={(event) => (value = event.target.value)}></textarea>
			<Button
				className="bg-green-300 mx-auto mt-5"
				onClick={(event) => {
					event.preventDefault()
					props.callback(value)
				}}>
				{t('pages.player.playlist.submit')}
			</Button>
		</>
	)
}
