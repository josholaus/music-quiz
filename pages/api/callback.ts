import spotify from '@lib/spotify'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != 'GET') {
        res.status(405).end()
        return
    }
    const spotifyResponse = await spotify.handleCallback(req)
    if (spotifyResponse.ok) {
        const { access_token, refresh_token }: SpotifyTokenResponse = await spotifyResponse.json()
        res.redirect(`/player?${new URLSearchParams({ access_token, refresh_token }).toString()}`)
    } else {
        res.redirect(`/player?${new URLSearchParams({ error: spotifyResponse.status.toString() }).toString()}`)
    }
}

export default handler
