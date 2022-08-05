import { useGlobalContext } from '@components/context'
import { LoadingComponent } from '@components/misc'
import { useEffect, useState } from 'react'
import PlayerError from './PlayerError'
import PlayerParent from './PlayerParent'
import PlayerTransferred from './PlayerTransferred'

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

    const {
        currentTrack,
        setCurrentTrack,
        setRevealed,
    }: {
        currentTrack: Spotify.Track | null
        setCurrentTrack: (track: Spotify.Track | null) => void
        setRevealed: (revealed: boolean) => void
    } = useGlobalContext()

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
            const playerObject = new Spotify.Player({
                name: 'Josholaus',
                getOAuthToken: async (cb: (token: string) => void) => {
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
                if (state) {
                    if (currentTrack != state.track_window.current_track) {
                        setRevealed(false)
                    }
                    setCurrentTrack(state.track_window.current_track)
                    setActive(state.context.uri != null)
                } else {
                    setActive(false)
                }
                setError(null)
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
        return <PlayerError error={error} />
    }

    if (!active || !playerState) {
        // TODO: Better playback transferred component
        return <PlayerTransferred />
    }

    return <PlayerParent player={player} playerState={playerState} deviceId={deviceId} />
}
