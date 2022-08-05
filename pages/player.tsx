import { NextPage } from 'next'
import Head from 'next/head'

import { SpotifyPlayer } from '@components/player/SpotifyPlayer'

interface PlayerProps {
    access_token?: string
    refresh_token?: string
}

const Player: NextPage = ({ access_token, refresh_token }: PlayerProps) => {
    if (!access_token || !refresh_token) {
        return (
            <>
                <Head>
                    <title>Error</title>
                </Head>
                <div>
                    <p>Your login is invalid</p>
                </div>
            </>
        )
    }
    return (
        <>
            <Head>
                <title>Josholaus Music Quiz</title>
            </Head>
            <SpotifyPlayer initialAccessToken={access_token.toString()} initialRefreshToken={refresh_token.toString()} />
        </>
    )
}

Player.getInitialProps = ({ query }: any) => {
    return query
}

export default Player
