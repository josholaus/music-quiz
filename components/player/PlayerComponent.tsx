import React from 'react'
import { usePlaybackState, useSpotifyPlayer, useWebPlaybackSDKReady } from 'react-spotify-web-playback-sdk'

const PlayerComponent: React.FC = React.memo(() => {
    const webPlaybackSDKReady = useWebPlaybackSDKReady()
    const player = useSpotifyPlayer()
    const playbackState = usePlaybackState()
    if (!webPlaybackSDKReady) {
        return <p>Loading ...</p>
    }
    if (!player || !playbackState) {
        return <p>Error while linking player component</p>
    }
    return (
        <>
            <p>Current song: {playbackState.track_window.current_track.name}</p>
            <button onClick={() => player.togglePlay()}><code>togglePlay</code></button>
        </>
    )
})

PlayerComponent.displayName = 'PlayerComponent'

export default PlayerComponent