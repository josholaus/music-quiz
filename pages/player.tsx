import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useCallback } from 'react'

import { Title } from '@components/headings'
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk'
import nookies from 'nookies'
import PlayerComponent from '@components/player/PlayerComponent'

type PlayerProps = {
    access_token: string
}

const Player: NextPage<PlayerProps> = ({ access_token }) => {
    const getOAuthToken: Spotify.PlayerInit['getOAuthToken'] = useCallback(
        (callback) => callback(access_token),
        [access_token],
    )

    return (
        <>
            <Head>
                <title>Josholaus Music Quiz</title>
            </Head>
            <Title>Player</Title>
            <WebPlaybackSDK
                initialDeviceName='Josholaus Music Quiz'
                getOAuthToken={getOAuthToken}
                connectOnInitialized={true}
                initialVolume={0.5}>
                <div>
                    <PlayerComponent />
                </div>
            </WebPlaybackSDK>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<PlayerProps> = async ({ query, req }) => {
    const stateFromCookies = nookies.get({ req }).state
    const stateFromRequest = query.state
    if (
        typeof stateFromRequest === 'string' &&
        stateFromCookies === stateFromRequest &&
        typeof query.code === 'string'
    ) {
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: query.code,
            redirect_uri: process.env.REDIRECT_URI ?? '',
            client_id: process.env.CLIENT_ID ?? '',
            client_secret: process.env.CLIENT_SECRET ?? '',
        })
        const res = await fetch(`https://accounts.spotify.com/api/token`, {
            method: 'POST',
            body,
        })
        if (res.ok) {
            const resJson = await res.json()
            if (resJson.access_token) {
                return {
                    props: {
                        access_token: resJson.access_token,
                    },
                }
            }
        }
    }
    return {
        redirect: {
            destination: '/',
            permanent: false,
        },
    }
}

export default Player
