import { LoadingComponent } from '@components/misc'
import { useEffect, useState } from 'react'
import { useWebPlaybackSDKReady } from './WebPlaybackSDK'

interface Props {
    accessToken: string
    refreshToken: string
}

export function SpotifyPlayer({ accessToken, refreshToken }: Props) {
    const [player, setPlayer] = useState<Spotify.Player | null>(null)

    const [ready, setReady] = useState<boolean>(false)
    const [active, setActive] = useState<boolean>(false)
    const [error, setError] = useState<Spotify.Error | null>(null)

    const [playerState, setPlayerState] = useState<Spotify.PlaybackState | null>(null)
    const [deviceId, setDeviceId] = useState<string | null>(null)

    const webPlaybackSDKReady = useWebPlaybackSDKReady()

    useEffect(() => {
        if (webPlaybackSDKReady) {
            console.log('Initializing Spotify Web Playback SDK...')
            const player = new Spotify.Player({
                name: 'Josholaus Music Quiz',
                getOAuthToken: async (cb: (token: string) => void) => {
                    cb(accessToken)
                },
                volume: 0.5,
            })
            player.on('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id)
                setDeviceId(device_id)
                setReady(true)
            })
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                setDeviceId(null)
                setReady(false)
            });
            player.on('player_state_changed', (state) => {
                console.log('Player State Changed', state)
                setPlayerState(state)
                setError(null)
                setActive(!(!state || !state.context.uri))
            })
            player.on('playback_error', (error) => {
                console.log('Playback Error', error)
                setError(error)
            })
            player.connect()
            setPlayer(player)
        }
    }, [webPlaybackSDKReady])

    if (!ready) {
        return <LoadingComponent />
    }

    if (error) {
        return (
            <div>
                <p>An error occurred:</p>
                <p>{error.message}</p>
            </div>
        )
    }

    if (!active) {
        return (
            <div>
                <p>Playback transferred</p>
            </div>
        )
    }

    const currentTrack = playerState?.track_window.current_track

    return (
        <div>
            <p>Currently playing:</p>
            <p>
                {currentTrack?.artists.map((artist) => artist.name).join(', ')} - {currentTrack?.name}
            </p>
        </div>
    )
}
