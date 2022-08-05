import React from 'react'
import PlayerController from './PlayerController'
import PlayerCover from './PlayerCover'
import PlayerMetadata from './PlayerMetadata'
import PlayerProgress from './PlayerProgress'

interface PlayerParentProps {
    player: Spotify.Player
    playerState: Spotify.PlaybackState
    deviceId: string | null
}

export default function PlayerParent(props: PlayerParentProps) {
    return (
        <div id="player">
            <div className="background flex flex-row items-center justify-center">
                <div id="left" className="flex flex-col w-80 m-5">
                    <PlayerMetadata currentTrack={props.playerState.track_window.current_track} />
                    <PlayerController player={props.player} playerState={props.playerState} deviceId={props.deviceId} />
                    <PlayerProgress playerState={props.playerState} player={props.player} />
                </div>
                <PlayerCover currentTrack={props.playerState.track_window.current_track} />
            </div>
        </div>
    )
}
