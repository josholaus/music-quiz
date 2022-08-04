import type { NextApiRequest, NextApiResponse } from 'next'
import spotify from '@lib/spotify'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != 'GET') {
        res.status(405).end()
        return
    }
    const spotifyURL = spotify.getLoginURL()
    res.redirect(spotifyURL)
}

export default handler
