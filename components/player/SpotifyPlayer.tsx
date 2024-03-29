import { GeneralButton } from '@components/buttons'
import { useGlobalContext } from '@components/context'
import { LoadingComponent } from '@components/misc'
import SpotifyClient from '@lib/spotifyClient'
import { useEffect, useRef, useState } from 'react'
import PlayerError from './PlayerError'
import PlayerParent from './PlayerParent'
import PlayerTransferred from './PlayerTransferred'

interface SpotifyPlayerProps {
    accessToken: string
    spotifyTracks: SpotifyApi.TrackObjectFull[]
}

// The spotify-web-playback-sdk typings are out of date (haven't been updated in 1 year+) ... there are new functions
type SpotifyOutOfBetaPolyfill = {
    activateElement: () => Promise<void>
}

export function SpotifyPlayer({ accessToken, spotifyTracks }: SpotifyPlayerProps) {
    const [player, setPlayer] = useState<(Spotify.Player & SpotifyOutOfBetaPolyfill) | null>(null)

    const [ready, setReady] = useState<boolean>(false)
    const [active, setActive] = useState<boolean>(false)
    const [error, setError] = useState<Spotify.Error | null>(null)

    const [playerState, setPlayerState] = useState<Spotify.PlaybackState | null>(null)
    const playerStateRef = useRef(playerState)
    const [deviceId, setDeviceId] = useState<string | null>(null)
    const [restricted, setRestricted] = useState<boolean>(false)

    const spotifyClient = new SpotifyClient(accessToken)

    const {
        setCurrentTrack,
        setRevealed,
        startTime,
    }: {
        setCurrentTrack: (track: Spotify.Track | null) => void
        setRevealed: (revealed: boolean) => void
        startTime: number
    } = useGlobalContext()

    useEffect(() => {
        playerStateRef.current = playerState
    })

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
            }) as Spotify.Player & SpotifyOutOfBetaPolyfill
            setPlayer(playerObject)
            playerObject.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id)
                setDeviceId(device_id)
                spotifyClient.playRandomTrack(spotifyTracks, device_id, startTime)
                setReady(true)
            })
            playerObject.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id)
                setDeviceId(null)
                setReady(false)
            })
            playerObject.addListener('player_state_changed', (state) => {
                console.log('Player State Changed', state)
                if (state) {
                    // Track has changed, hide track info
                    if (playerStateRef.current?.track_window.current_track && state.track_window.current_track &&
                        playerStateRef.current?.track_window.current_track.id != state.track_window.current_track.id) {
                        setRevealed(false)
                    }
                    setPlayerState(state)
                    setCurrentTrack(state.track_window.current_track)
                    // If the playback was transferred, Spotify sends us a null uri for whatever reason
                    setActive(state.context.uri != null)
                } else {
                    setActive(false)
                    setPlayerState(state)
                }
                setError(null)
            })
            playerObject.addListener('playback_error', (error) => {
                console.log('Playback Error', error)
                setError(error)
            })
            playerObject.addListener('autoplay_failed', () => {
                console.log('Autoplay is not allowed by the browser autoplay rules')
                setRestricted(true)
            })
            playerObject.connect().then((connected) => {
                console.log(connected ? 'Successfully connected to Spotify' : 'Failed to connect to Spotify')
            })
        }
        return () => {
            document.body.removeChild(scriptTag)
        }
    }, [])

    if (restricted) {
        return (
            <div>
                <GeneralButton
                    onClick={() => {
                        if (!player) {
                            return
                        }
                        setRestricted(false)
                        player.activateElement().then(() => {
                            player.resume()
                        })
                    }}>
                    Connect
                </GeneralButton>
            </div>
        )
    }

    if (!ready || !player || !playerState) {
        return <LoadingComponent />
    }

    if (error) {
        return <PlayerError error={error} />
    }

    if (!active) {
        return <PlayerTransferred />
    }

    return (
        <PlayerParent
            player={player}
            playerState={playerState}
            deviceId={deviceId ?? ''}
            spotifyTracks={spotifyTracks}
            spotifyClient={spotifyClient}
        />
    )
}
