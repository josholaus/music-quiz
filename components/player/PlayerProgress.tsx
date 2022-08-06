import { useEffect, useState } from 'react'

interface PlayerProgressProps {
    playerState: Spotify.PlaybackState
    player: Spotify.Player
}

function pad(num: number, places: number): string {
    return String(num).padStart(places, '0')
}

export default function PlayerProgress(props: PlayerProgressProps) {
    const [playerState, setPlayerState] = useState(props.playerState)
    const [time, setTime] = useState(Math.floor(props.playerState.position / 1000))
    const [maxTime, setMaxTime] = useState(Math.floor(props.playerState.duration / 1000))

    useEffect(() => {
        const interval = setInterval(async () => {
            const state = await props.player.getCurrentState()
            if (state) {
                setPlayerState(state)
                setTime(Math.floor(state.position / 1000))
                setMaxTime(Math.floor(state.duration / 1000))
            }
        }, 500)
        return () => {
            clearInterval(interval)
        }
    }, [props.player])

    const remainingTime = () => {
        return maxTime - time
    }

    const timeString = () => {
        return `${Math.floor(time / 60)}:${pad(time % 60, 2)}`
    }

    const remainingTimeString = () => {
        return `${Math.floor(remainingTime() / 60)}:${pad(remainingTime() % 60, 2)}`
    }

    return (
        <div className="flex flex-row m-3 items-center">
            <p className="px-3 custom-mono">{timeString()}</p>
            <div className="flex flex-start bg-blue-grey-50 w-full h-1.5 rounded-full bg-slate-200/40">
                <div
                    className="h-full bg-black rounded-full"
                    style={{
                        width: `${Math.floor((time / maxTime) * 100)}%`,
                    }}></div>
            </div>
            <p className="px-3 custom-mono">-{remainingTimeString()}</p>
        </div>
    )
}
