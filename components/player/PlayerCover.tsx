import { useGlobalContext } from '@components/context'
import React from 'react'

interface PlayerCoverProps {
    currentTrack: Spotify.Track
}

export default function PlayerCover(props: PlayerCoverProps) {
    const {
        revealed,
        setRevealed,
    }: {
        revealed: boolean
        setRevealed: (revealed: boolean) => void
    } = useGlobalContext()
    const coverUrl = !props.currentTrack ? '/assets/placeholder.png' : props.currentTrack.album.images[0].url
    const questionUrl = '/assets/question.png'

    const clickCover = () => {
        if (revealed) {
            return
        }
        setRevealed(true)
    }

    return (
        <div
            className={`w-72 sm:w-44 mx-8 ${revealed ? '' : 'cursor-pointer'}`}
            title={revealed ? '' : 'Click to reveal'}
            onClick={() => clickCover()}>
            <img className="rounded-md shadow-md" src={revealed ? coverUrl : questionUrl} />
        </div>
    )
}
