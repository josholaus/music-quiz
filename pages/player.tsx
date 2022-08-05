import { NextPage } from 'next'
import Head from 'next/head'

import { SpotifyPlayer } from '@components/player/SpotifyPlayer'
import { useEffect, useState } from 'react'
import { Title } from '@components/headings'

interface PlayerProps {
    access_token?: string
    refresh_token?: string
}

const Player: NextPage = ({ access_token, refresh_token }: PlayerProps) => {
    const [accessToken, setAccessToken] = useState(access_token)
    const [refreshToken, setRefreshToken] = useState(refresh_token)

    useEffect(() => {
        if (!refreshToken) {
            console.error('Did not receive refresh token, cannot refresh')
            return
        }
        setInterval(async () => {
            const params = new URLSearchParams({
                refreshToken,
            })
            const { access_token, refresh_token } = await fetch(`/api/refresh_token?${params.toString()}`).then((res) =>
                res.json(),
            )
            setAccessToken(access_token)
            setRefreshToken(refresh_token)
        }, 3600 * 1000)
    })

    if (!accessToken || !refreshToken) {
        return (
            <div>
                <Title>An error occurred</Title>
                <p>Your login is invalid</p>
            </div>
        )
    }
    return <SpotifyPlayer initialAccessToken={accessToken.toString()} initialRefreshToken={refreshToken.toString()} />
}

Player.getInitialProps = ({ query }: any) => {
    return query
}

export default Player
