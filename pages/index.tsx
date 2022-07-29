import type { NextPage } from 'next'
import Head from 'next/head'

import { MegaTitle } from '@components/headings'
import { FlowText, Quote } from '@components/text'
import { SpotifyButton } from '@components/buttons'

const Home: NextPage = () => (
    <>
        <Head>
            <title>Music Quiz - Josholaus</title>
            <meta name="description" content="Josholaus Music Quiz back at it again lol" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col space-y-2">
            <MegaTitle>Music Quiz</MegaTitle>
            <FlowText className="text-lg">
                Hey there! As of now, this app is in <span className="font-bold">closed beta mode</span>.
            </FlowText>
            <FlowText className="text-lg">
                If you have already been invited by either Nico or Josh, <br /> click the button below and login with
                your Spotify account!
            </FlowText>
            <Quote className="mt-5" author="Rick Sanchez">
                I don&apos;t discuss problems, I incinerate them.
            </Quote>
            <SpotifyButton className="mt-8" link="/api/login">
                Connect to Spotify
            </SpotifyButton>
        </div>
    </>
)

export default Home
