import type { NextPage } from 'next'

import { MegaTitle } from '@components/headings'
import { Quote } from '@components/text'
import { SpotifyButton } from '@components/buttons'

const Home: NextPage = () => (
    <>
        <div className="flex flex-col space-y-4">
            <MegaTitle>Music Quiz</MegaTitle>
            <p>
                Hey there! As of now, this app is in <span className="font-bold">closed beta mode</span>.<br />
                If you have already been invited by either Nico or Josh, click the button below and login with your
                Spotify account!
            </p>
            <SpotifyButton link="/api/login">Connect to Spotify</SpotifyButton>
            <Quote className="text-xs" author="Rick Sanchez">
                I don&apos;t discuss problems, I incinerate them.
            </Quote>
        </div>
    </>
)

export default Home
