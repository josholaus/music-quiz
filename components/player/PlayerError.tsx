import { Title } from '@components/headings'

interface PlayerErrorProps {
    error?: Spotify.Error | null
}

export default function PlayerError(props: PlayerErrorProps) {
    return (
        <div id="player-error">
            <Title>An error occurred</Title>
            <p>This might be caused by a bug in Spotify&apos;s Web Playback SDK</p>
            <p>Please wait a bit and if this message doesn&apos;t disappear, try reloading the page</p>
            {props.error && (
                <p>
                    <span className="text-bold">Error details:</span> {props.error.message}
                </p>
            )}
        </div>
    )
}
