import React from 'react'

interface PlayerMetadataProps {
    currentTrack: Spotify.Track
}

export default function PlayerMetadata(props: PlayerMetadataProps) {
    const title = props.currentTrack.name
    const artist = props.currentTrack.artists.map((artist) => artist.name).join(', ')
    const album = props.currentTrack.album.name
    return (
        <div className="text-center">
            <p className="font-bold text-xl">{title}</p>
            <p className="font-semibold">{artist}</p>
            <p className="text-sky-500">{album}</p>
        </div>
    )
}
