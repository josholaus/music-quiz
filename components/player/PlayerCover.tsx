import React from 'react'

interface PlayerCoverProps {
    currentTrack: Spotify.Track
    revealed: boolean
}

export default function PlayerCover(props: PlayerCoverProps) {
    const coverUrl = props.currentTrack.album.images[0].url
    const questionUrl = '/assets/question.svg'
    return (
        <div className="w-44 mx-8">
            <img className="rounded-md shadow-md" src={props.revealed ? coverUrl : questionUrl} />
        </div>
    )
}
