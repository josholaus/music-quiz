import type { NextApiRequest, NextApiResponse } from 'next'
import spotify from '@lib/spotify'
import qs from 'qs'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != 'GET') {
        res.status(405).end()
        return
    }
    const spotifyResponse = await spotify.handleCallback(req)
    if (spotifyResponse.ok) {
        const { access_token, refresh_token }: SpotifyTokenResponse = await spotifyResponse.json()
        res.redirect(`/player?${qs.stringify({ access_token, refresh_token })}`)
    } else {
        res.redirect(`/player?${qs.stringify({ error: spotifyResponse.status })}`)
    }
}

export default handler
