import qs from 'qs'
import { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'
import generateRandomString from '@lib/util'

class SpotifyClient {
    private scopes = [
        'playlist-read-private',
        'streaming',
        'app-remote-control',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'user-read-email', // ...
        'user-read-private', // these two are needed according to https://spoti.fi/2TqRxM0
    ].join(' ')
    private headers = {}

    constructor(private clientId: string, private clientSecret: string, private redirectUri: string) {
        this.headers = {
            Authorization: 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }

    public getLoginURL(req: NextApiRequest, res: NextApiResponse): string {
        const state = generateRandomString(16)
        setCookie({ res }, "state", state, {
            maxAge: 3600000,
            secure: !req.headers.host?.includes("localhost"),
            httpOnly: true,
            path: "/",
        });
        return `https://accounts.spotify.com/authorize?${qs.stringify({
            response_type: 'code',
            client_id: this.clientId,
            scope: encodeURIComponent(this.scopes),
            redirect_uri: this.redirectUri,
            state
        })}`
    }
}

export default new SpotifyClient(
    process.env.CLIENT_ID ?? '',
    process.env.CLIENT_SECRET ?? '',
    process.env.REDIRECT_URI ?? '',
)
