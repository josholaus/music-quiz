import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useCallback } from 'react'

import { Title } from '@components/headings'
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk'

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
                initialDeviceName="Spotify Player on Next.js"
                getOAuthToken={getOAuthToken}
                connectOnInitialized={true}
                initialVolume={0.5}>
                <div></div>
            </WebPlaybackSDK>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<PlayerProps> = async ({ query }) => {
    if (!query.access_token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    if (query.refresh_token) {
        const res = await fetch(`/api/refresh_token?refresh_token=${query.refresh_token}`)
        if (res.ok) {
            const json = await res.json()
            return {
                props: {
                    access_token: json.access_token,
                },
            }
        } else {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
    }
    return {
        props: {
            access_token: query.access_token,
        },
    }
}

export default Player
