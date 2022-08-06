import React, { useEffect, useState } from 'react'

import { Title } from '@components/headings'
import { GeneralButton } from '@components/buttons'
import SpotifyClient from '@lib/spotifyClient'
import { LoadingComponent } from '@components/misc'

interface PlaylistInputProps {
    setSpotifyTracks: (tracks: SpotifyApi.TrackObjectFull[]) => void
    accessToken: string
}

export default function PlaylistInput(props: PlaylistInputProps) {
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const spotifyClient = new SpotifyClient(props.accessToken)

    useEffect(() => {
        if (value === '') {
            const storage = localStorage.getItem('playlist-input')
            if (storage) {
                setValue(storage)
            }
            return
        }
        localStorage.setItem('playlist-input', value)
    }, [value])

    const validateUrls = () => {
        const urls = value.split('\n').filter((url) => url.length > 0)
        if (urls.length == 0) {
            return []
        }
        const playlistIds: string[] = []
        for (const url of urls) {
            try {
                const urlObject = new URL(url)
                if (
                    urlObject.hostname != 'open.spotify.com' ||
                    !urlObject.pathname.startsWith('/playlist/') ||
                    urlObject.pathname.split('/').length != 3
                ) {
                    return []
                }
                playlistIds.push(urlObject.pathname.split('/')[2])
            } catch (_) {
                return []
            }
        }
        return playlistIds
    }

    const submit = async () => {
        const playlistIds = validateUrls()
        if (playlistIds.length == 0) {
            // TODO: better modal?
            alert('Please enter valid playlist URLs')
            return
        }
        setLoading(true)
        const entries: SpotifyApi.PlaylistTrackObject[] = (
            await Promise.all(playlistIds.map((playlistId) => spotifyClient.getPlaylistTracks(playlistId)))
        ).flat()
        if (!entries[0]) {
            // TODO: better modal?
            alert('Could not find tracks, is the access token still valid?')
            setLoading(false)
            return
        }
        const tracks = entries.map((e) => e.track).filter((e) => e)
        const ids: string[] = []
        const uniqueTracks = tracks
            .filter((track) => {
                if (!track) {
                    return false
                }
                if (ids.includes(track.id)) {
                    return false
                }
                ids.push(track.id)
                return true
            })
            .filter((e) => e) as SpotifyApi.TrackObjectFull[]
        setLoading(false)
        if (uniqueTracks.length == 0) {
            // TODO: better modal?
            alert('No tracks found')
            return
        }
        props.setSpotifyTracks(uniqueTracks)
    }

    if (loading) {
        return <LoadingComponent />
    }

    return (
        <div id="playlist-input" className="flex flex-col space-y-4 justify-center items-center">
            <Title>Playlists</Title>
            <p>Enter links to all playlists you want to play with (seperated by newlines)</p>
            <textarea
                id="playlist-values"
                placeholder="Playlist URLs"
                className="w-full p-3 border border-gray-500 rounded-md"
                defaultValue={value}
                onChange={(event) => setValue(event.target.value)}></textarea>
            <GeneralButton className="px-12" onClick={() => submit()}>
                Submit
            </GeneralButton>
        </div>
    )
}
