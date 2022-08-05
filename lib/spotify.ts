import { NextApiRequest } from 'next'

class Spotify {
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

    public getLoginURL(): string {
        return `https://accounts.spotify.com/authorize?${new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            scope: this.scopes,
            redirect_uri: this.redirectUri,
        }).toString()}`
    }

    public async handleCallback(req: NextApiRequest): Promise<Response> {
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: req.query.code?.toString() ?? '',
            redirect_uri: this.redirectUri,
        }).toString()
        return this.sendTokenRequest(body)
    }

    public async handleRefresh(req: NextApiRequest): Promise<Response> {
        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: req.query.refresh_token?.toString() ?? '',
        }).toString()
        return this.sendTokenRequest(body)
    }

    private async sendTokenRequest(body: string): Promise<Response> {
        this.headers = {
            ...this.headers,
            'Content-Length': body.length.toString(),
        }
        return fetch('https://accounts.spotify.com/api/token', {
            method: 'post',
            headers: this.headers,
            body,
        })
    }
}

export default new Spotify(process.env.CLIENT_ID ?? '', process.env.CLIENT_SECRET ?? '', process.env.REDIRECT_URI ?? '')
