import { NextPage } from 'next'

import { Title } from '@components/headings'
import { SpotifyPlayer } from '@components/player/SpotifyPlayer'
import { PlaylistInput } from '@components/playlists'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface PlayerProps {
    access_token?: string
    refresh_token?: string
}

const Player: NextPage = ({ access_token, refresh_token }: PlayerProps) => {
    const router = useRouter()

    const [accessToken, setAccessToken] = useState(access_token)
    const [refreshToken, setRefreshToken] = useState(refresh_token)
    const [spotifyTracks, setSpotifyTracks] = useState<SpotifyApi.TrackObjectFull[]>([])

    useEffect(() => {
        if (!refreshToken) {
            console.error('Did not receive refresh token, cannot refresh')
            return
        }
        const interval = setInterval(async () => {
            const params = new URLSearchParams({
                refreshToken,
            })
            const { access_token, refresh_token } = await fetch(`/api/refresh_token?${params.toString()}`).then((res) =>
                res.json(),
            )
            setAccessToken(access_token)
            setRefreshToken(refresh_token)
        }, 3600 * 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    useEffect(() => {
        // Update the accessToken in the path name so the page still works on reload
        const { pathname, query } = router
        query.access_token = accessToken
        router.replace({
            pathname,
            query: {
                ...query,
            },
        })
    }, [accessToken])

    if (!accessToken || !refreshToken) {
        return (
            <div>
                <Title>An error occurred</Title>
                <p>Your login is invalid</p>
            </div>
        )
    }

    if (spotifyTracks.length === 0) {
        return (
            <PlaylistInput
                setSpotifyTracks={(tracks: SpotifyApi.TrackObjectFull[]) => setSpotifyTracks(tracks)}
                accessToken={accessToken}
            />
        )
    }

    return <SpotifyPlayer accessToken={accessToken.toString()} spotifyTracks={spotifyTracks} />
}

Player.getInitialProps = ({ query }: any) => {
    return query
}

export default Player
