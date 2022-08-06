import SpotifyClient from '@lib/spotifyClient'
import React from 'react'
import PlayerController from './PlayerController'
import PlayerCover from './PlayerCover'
import PlayerMetadata from './PlayerMetadata'
import PlayerProgress from './PlayerProgress'

interface PlayerParentProps {
    player: Spotify.Player
    playerState: Spotify.PlaybackState
    deviceId: string
    spotifyTracks: SpotifyApi.TrackObjectFull[]
    spotifyClient: SpotifyClient
}

export default function PlayerParent(props: PlayerParentProps) {
    return (
        <div id="player">
            <div className="background flex flex-col-reverse sm:flex-row  items-center justify-center">
                <div id="left" className="flex flex-col w-80 m-5">
                    <PlayerMetadata currentTrack={props.playerState.track_window.current_track} />
                    <PlayerController player={props.player} playerState={props.playerState} deviceId={props.deviceId} spotifyTracks={props.spotifyTracks} spotifyClient={props.spotifyClient} />
                    <PlayerProgress playerState={props.playerState} player={props.player} />
                    <p className="text-xs">songs left: {props.spotifyTracks.length}</p>
                </div>
                <PlayerCover currentTrack={props.playerState.track_window.current_track} />
            </div>
        </div>
    )
}
