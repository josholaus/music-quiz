import { useGlobalContext } from '@components/context'

interface PlayerMetadataProps {
    currentTrack: Spotify.Track
}

export default function PlayerMetadata(props: PlayerMetadataProps) {
    const { revealed } = useGlobalContext()

    const title = revealed ? props.currentTrack.name : '?'
    const artist = revealed ? props.currentTrack.artists.map((artist) => artist.name).join(', ') : '?'
    const album = revealed ? props.currentTrack.album.name : '?'
    return (
        <div className="text-center">
            <p className="font-bold text-xl">{title}</p>
            <p className="font-semibold">{artist}</p>
            <p className="text-sky-500">{album}</p>
        </div>
    )
}
