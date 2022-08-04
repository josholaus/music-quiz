import { NextPage } from 'next'
import Head from 'next/head'

import { WebPlaybackSDK } from '@components/player'

interface PlayerProps {
    access_token?: string
    refresh_token?: string
}

const Player: NextPage = ({ access_token, refresh_token }: PlayerProps) => {
    if (!access_token || !refresh_token) {
        return (
            <div>
                <p>Your login is invalid</p>
            </div>
        )
    }
    return (
        <>
            <Head>
                <title>Josholaus Music Quiz</title>
            </Head>
            <WebPlaybackSDK accessToken={access_token.toString()} refreshToken={refresh_token.toString()} />
        </>
    )
}

Player.getInitialProps = ({ query }: any) => {
    return query
}

export default Player
