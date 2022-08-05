import { LoadingComponent } from '@components/misc'
import { useEffect, useState } from 'react'
import PlayerParent from './PlayerParent'

interface Props {
    initialAccessToken: string
    initialRefreshToken: string
}

export function SpotifyPlayer({ initialAccessToken, initialRefreshToken }: Props) {
    const [player, setPlayer] = useState<Spotify.Player | null>(null)
    const [accessToken, setAccessToken] = useState<string>(initialAccessToken)
    const [refreshToken, setRefreshToken] = useState<string>(initialRefreshToken)

    const [ready, setReady] = useState<boolean>(false)
    const [active, setActive] = useState<boolean>(false)
    const [error, setError] = useState<Spotify.Error | null>(null)

    const [playerState, setPlayerState] = useState<Spotify.PlaybackState | null>(null)
    const [deviceId, setDeviceId] = useState<string | null>(null)

    useEffect(() => {
        const scriptTag = document.createElement('script')
        scriptTag.src = 'https://sdk.scdn.co/spotify-player.js'
        scriptTag.async = true
        document.body.appendChild(scriptTag)
        let init = false
        window.onSpotifyWebPlaybackSDKReady = () => {
            if (init) {
                return
            }
            init = true
            console.log('Initializing Spotify Web Playback SDK...')
            let firstTime = true
            const playerObject = new window.Spotify.Player({
                name: 'Josholaus',
                getOAuthToken: async (cb: (token: string) => void) => {
                    if (!firstTime) {
                        console.log('Refreshing token...')
                        const params = new URLSearchParams({ refresh_token: refreshToken }).toString()
                        const res = await fetch(`/api/refresh_token?${params}`, {
                            method: 'GET',
                        })
                        const { access_token, refresh_token } = await res.json()
                        setAccessToken(access_token)
                        setRefreshToken(refresh_token)
                        cb(access_token)
                        return
                    }
                    firstTime = false
                    cb(accessToken)
                },
                volume: 0.5,
            })
            setPlayer(playerObject)
            playerObject.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id)
                setDeviceId(device_id)
                setReady(true)
            })
            playerObject.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id)
                setDeviceId(null)
                setReady(false)
            })
            playerObject.addListener('player_state_changed', (state) => {
                console.log('Player State Changed', state)
                setPlayerState(state)
                setError(null)
                setActive(!(!state || !state.context.uri))
            })
            playerObject.addListener('playback_error', (error) => {
                console.log('Playback Error', error)
                setError(error)
            })
            playerObject.connect().then((connected) => {
                console.log(connected ? 'Successfully connected to Spotify' : 'Failed to connect to Spotify')
            })
        }
    }, [])

    if (!ready || !player) {
        return <LoadingComponent />
    }

    if (error) {
        // TODO: Better error component
        return (
            <div>
                <p>An error occurred:</p>
                <p>{error.message}</p>
            </div>
        )
    }

    if (!active || !playerState) {
        // TODO: Better playback transferred component
        return (
            <div>
                <p>Playback transferred</p>
            </div>
        )
    }

    return (<PlayerParent player={player} playerState={playerState} deviceId={deviceId} />)
}
