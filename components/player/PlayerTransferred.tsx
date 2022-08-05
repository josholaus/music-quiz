import { Title } from '@components/headings'
import React from 'react'

export default function PlayerTransferred() {
    return (
        <div id="player-transferred">
            <Title>Player transferred</Title>
            <p>It seems like Spotify was connected to a different device.</p>
            <p>Try reloading the page</p>
        </div>
    )
}
