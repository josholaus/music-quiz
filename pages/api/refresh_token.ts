import spotify from '@lib/spotify'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != 'GET') {
        res.status(405).end()
        return
    }
    const spotifyResponse = await spotify.handleRefresh(req)
    if (spotifyResponse.ok) {
        const { access_token }: SpotifyTokenResponse = await spotifyResponse.json()
        res.send({ access_token, refresh_token: req.query.refreshToken })
    } else {
        res.send({ error: spotifyResponse.status })
    }
}

export default handler
