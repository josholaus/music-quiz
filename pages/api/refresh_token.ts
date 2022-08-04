import type { NextApiRequest, NextApiResponse } from 'next'
import spotify from '@lib/spotify'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != 'GET') {
        res.status(405).end()
        return
    }
    const spotifyResponse = await spotify.handleRefresh(req)
    if (spotifyResponse.ok) {
        const { access_token }: SpotifyTokenResponse = await spotifyResponse.json()
        res.send({ access_token, refresh_token: req.query.refresh_token })
    } else {
        res.send({ error: spotifyResponse.status })
    }
}

export default handler
