import type { NextPage } from 'next'

import { SpotifyButton } from '@components/buttons'
import { MegaTitle } from '@components/headings'
import { Quote } from '@components/text'

const Home: NextPage = () => (
    <>
        <div className="flex flex-col space-y-4">
            <MegaTitle>Music Quiz</MegaTitle>
            <p>
                Please note that you have to be invited by the owner of this application in order to be able to play
                music quiz.
                <br /> If you are already invited, please click the button below to start playing.
            </p>
            <SpotifyButton link="/api/login">Connect to Spotify</SpotifyButton>
            <Quote className="text-xs" author="Rick Sanchez">
                I don&apos;t discuss problems, I incinerate them.
            </Quote>
        </div>
    </>
)

export default Home
